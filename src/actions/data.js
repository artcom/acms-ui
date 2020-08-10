import { isPlainObject } from "lodash"
import { getChangedContent, selectTemplates, getVersion, getContentPath } from "../selectors"
import { showError } from "./error"
import { createChildValue, createFieldValue, getTemplate, isValid } from "../utils"

export function loadData(configServer, configPath) {
  return async dispatch => {
    try {
      const { data: config, version } = await configServer.queryJson(configPath)

      const [{ data: templates }, { data: content }] = await Promise.all([
        configServer.queryFiles(config.templatesPath, version),
        configServer.queryJson(config.contentPath, version)
      ])

      dispatch(updateData(config, content, templates, version))
    } catch (error) {
      dispatch(showError("Failed to load Data", error))
    }
  }
}

export function fixContent() {
  return async (dispatch, getState) => {
    try {
      const { originalContent, templates } = getState()

      const content = originalContent.toJS()
      fixEntries(content, templates)

      dispatch({
        type: "FIX_CONTENT",
        payload: {
          content
        }
      })
    } catch (error) {
      dispatch(showError("Failed to fix Data", error))
    }
  }
}

function fixEntries(entity, templates) {
  const { template, ...allEntries } = entity
  const { fields = [], fixedChildren = [], children = [] } = getTemplate(template, templates)

  // fix invalid fields
  fields.forEach(field => {
    if (!isValid(entity[field.id], field)) {
      entity[field.id] = createFieldValue(field) // eslint-disable-line no-param-reassign
    }
  })

  // fix fixedChildren
  fixedChildren.forEach(child => {
    if (!isPlainObject(entity[child.id])) {
      // eslint-disable-next-line no-param-reassign
      entity[child.id] = createChildValue(child.template, templates)
    } else {
      fixEntries(entity[child.id], templates)
    }
  })

  // fix additional children
  const namedEntries = [...fields, ...fixedChildren].map(({ id }) => id)
  const additionalChildIds = Object.keys(allEntries).filter(id => !namedEntries.includes(id))
  additionalChildIds.forEach(id => {
    if (!children.includes(entity[id].template)) {
      // delete children with invalid template
      delete entity[id] // eslint-disable-line no-param-reassign
    } else {
      fixEntries(entity[id], templates)
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
      dispatch(startSaving())

      const contentFiles = toFiles(content.toJS(), templates)
      await configServer.save(contentFiles, contentPath, version)

      dispatch(loadData(configServer, configPath))
    } catch (error) {
      dispatch(showError("Failed to save Data", error))
    }
  }
}

function startSaving() {
  return {
    type: "START_SAVING"
  }
}

function updateData(config, content, templates, version) {
  return {
    type: "UPDATE_DATA",
    payload: {
      config,
      content,
      templates,
      version
    }
  }
}


function toFiles({ template, ...content }, templates, path = []) {
  const files = {}
  const fields = getTemplate(template, templates).fields || []

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
