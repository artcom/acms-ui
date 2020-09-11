import { produce } from "immer"
import isPlainObject from "lodash/isPlainObject"
import { getChangedContent, selectTemplates, getVersion, getContentPath } from "../selectors"
import { showError } from "./error"
import * as utils from "../utils"
import { isLocalized } from "../language"
import defaultConfig from "../defaultConfig.json"


export function loadData(configServer, configPath) {
  return async dispatch => {
    try {
      const { data: config, version } = await configServer.queryJson(configPath)

      const [{ data: templates }, { data: originalContent }] = await Promise.all([
        configServer.queryFiles(config.templatesPath, version),
        configServer.queryJson(config.contentPath, version)
      ])

      const changedContent = produce(originalContent,
        draft => fixContent(originalContent, draft, templates, config.languages)
      )

      dispatch({
        type: "UPDATE_DATA",
        payload: {
          config: { ...defaultConfig, ...config },
          originalContent,
          changedContent,
          templates,
          version
        }
      })
    } catch (error) {
      const details = error.response ? JSON.stringify(error.response, null, 2) : error.stack
      dispatch(showError("Failed to load Data", details))
    }
  }
}

function fixContent(content, draft, templates, languages) {
  const { template, ...allEntries } = content
  const { fields = [], fixedChildren = [], children = [] } = utils.getTemplate(template, templates)

  // fix invalid fields
  fields.forEach(field => {
    if (isLocalized(content[field.id], languages)) {
      for (const [language, value] of Object.entries(content[field.id])) {
        if (!utils.isValidField(value, field)) {
          // eslint-disable-next-line no-param-reassign
          draft[field.id][language] = utils.createFieldValue(field)
        }
      }
    } else {
      if (!utils.isValidField(content[field.id], field)) {
        // eslint-disable-next-line no-param-reassign
        draft[field.id] = utils.createFieldValue(field)
      }
    }
  })

  // fix fixedChildren
  fixedChildren.forEach(child => {
    if (!isPlainObject(content[child.id])) {
      // eslint-disable-next-line no-param-reassign
      draft[child.id] = utils.createChildValue(child.template, templates)
    } else {
      fixContent(content[child.id], draft[child.id], templates, languages)
    }
  })

  // fix additional children
  const namedEntries = [...fields, ...fixedChildren].map(({ id }) => id)
  const additionalChildIds = Object.keys(allEntries).filter(id => !namedEntries.includes(id))
  additionalChildIds.forEach(id => {
    if (!children.includes(content[id].template)) {
      // delete children with invalid template
      delete draft[id] // eslint-disable-line no-param-reassign
    } else {
      fixContent(content[id], draft[id], templates, languages)
    }
  })
}

export function saveData(configServer, configPath) {
  return async (dispatch, getState) => {
    const state = getState()
    const version = getVersion(state)
    const content = getChangedContent(state)
    const templates = selectTemplates(state)
    const contentPath = getContentPath(state)

    try {
      dispatch({ type: "START_SAVING" })

      const contentFiles = toFiles(content, templates)
      await configServer.save(contentFiles, contentPath, version)

      dispatch(loadData(configServer, configPath))
    } catch (error) {
      dispatch(showError("Failed to save Data", error))
    }
  }
}

function toFiles({ template, ...content }, templates, path = []) {
  const files = {}
  const fields = utils.getTemplate(template, templates).fields || []

  // add index file
  const fieldIds = fields.map(({ id }) => id)
  files[[...path, "index"].join("/")] = fieldIds.reduce(
    (result, id) => ({ ...result, [id]: content[id] }),
    { template }
  )

  // add all fixed children files
  const childIds = Object.keys(content).filter(id => !fieldIds.includes(id))
  childIds.forEach(id => Object.assign(files, toFiles(content[id], templates, [...path, id])))

  return files
}
