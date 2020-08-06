import isUndefined from "lodash/isUndefined"

import { getChangedContent, getVersion } from "../selectors"
import { showError } from "./error"
import { getTemplate } from "../utils"

export function loadData(configServer, cmsConfigPath) {
  return async dispatch => {
    try {
      const { data: config, version } = await configServer.queryJson(cmsConfigPath)
      const { data: templates } = await configServer.queryFiles(config.templatesPath, version)
      const { data: content } = await configServer.queryJson(config.contentPath, version)

      dispatch(updateData(config, content, templates, version))
    } catch (error) {
      dispatch(showError("Failed to Load Data", error))
    }
  }
}

export function fixContent() {
  return async (dispatch, getState) => {
    const { originalContent, templates } = getState()

    const content = originalContent.toJS()
    fixEntries(content, templates)

    dispatch({
      type: "FIX_CONTENT",
      payload: {
        content
      }
    })
  }
}

function fixEntries(entity, templates) {
  const allEntries = Object.keys(entity).filter(entry => entry !== "template")
  const { fields = [], fixedChildren = [], children = [] } = getTemplate(entity.template, templates)

  const namedEntries = [...fields, ...fixedChildren]

  // create missing named entries
  const missingEntries = namedEntries.filter(({ id }) => !allEntries.includes(id))
  missingEntries.forEach(entry => {
    // eslint-disable-next-line no-param-reassign
    entity[entry.id] = createValue(entry, templates)
  })

  // fix fixed children
  fixedChildren.forEach(child => fixEntries(entity[child.id], templates))

  // fix additional children
  const additionalChildren = allEntries
    .filter(id => namedEntries.findIndex(entry => id === entry.id) === -1)
  additionalChildren.forEach(child => {
    if (!children.includes(entity[child].template)) {
      // delete children with invalid template
      // eslint-disable-next-line no-param-reassign
      delete entity[child]
    } else {
      fixEntries(entity[child], templates)
    }
  })
}

function createValue(entry, templates) {
  return entry.type ? createFieldValue(entry) : createChild(entry, templates)
}

function createFieldValue(field) {
  if (!isUndefined(field.default)) {
    return field.default
  }

  switch (field.type) {
    case "enum":
      return field.values[0].value
    case "boolean":
      return false
    case "markdown":
    case "string":
      return ""
    case "number":
      return 0

    default:
      return null
  }
}

function createChild({ template }, templates) {
  const { fields = [], fixedChildren = [] } = getTemplate(template, templates)

  const child = { template };
  [...fields, ...fixedChildren].forEach(entry => {
    child[entry.id] = createValue(entry, templates)
  })

  return child
}

export function saveData(configServer) {
  return async (dispatch, getState) => {
    const state = getState()
    const version = getVersion(state)
    const content = getChangedContent(state)

    try {
      dispatch(startSaving())
      await configServer.updateContent(content.toJS(), version)
      dispatch(loadData(configServer))
    } catch (error) {
      dispatch(showError("Failed to Save Data", error))
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
