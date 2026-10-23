import { createNextState } from "@reduxjs/toolkit"
import isPlainObject from "lodash/isPlainObject"
import {
  getChangedContent,
  getContentFiles,
  selectTemplates,
  getVersion,
  getContentPath,
} from "../selectors"
import { showError } from "./error"
import * as utils from "../utils"
import { toFiles } from "../utils/files"

export function loadData(acmsApi, acmsConfigPath) {
  return async (dispatch) => {
    try {
      const { data: config, version: commit } = await acmsApi.queryJson(acmsConfigPath)

      // load everything from the same commit, falls back to the default branch if the API
      // does not expose the commit hash
      const [{ data: unresolvedTemplates }, { data: originalContent }, { data: contentFiles }] =
        await Promise.all([
          acmsApi.queryFiles(config.templatesPath, commit),
          acmsApi.queryJson(config.contentPath, commit),
          acmsApi.queryFiles(config.contentPath, commit),
        ])

      const templates = createNextState(unresolvedTemplates, (draft) =>
        resolveCustomTypes(unresolvedTemplates, draft, config.customTypes),
      )

      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates),
      )

      dispatch({
        type: "UPDATE_DATA",
        payload: {
          config,
          originalContent,
          changedContent,
          contentFiles,
          templates,
          version: acmsApi.defaultBranch,
        },
      })
    } catch (error) {
      const details = error.response ? JSON.stringify(error.response, null, 2) : error.stack
      dispatch(showError("Failed to load Data", details))
    }
  }
}

export function searchData(search) {
  return {
    type: "SET_SEARCH",
    payload: {
      search,
    },
  }
}

function resolveCustomTypes(templates, draft, customTypes = {}) {
  Object.entries(templates).forEach(([templateId, { fields = [] }]) => {
    fields.forEach((field, index) => {
      const customType = customTypes[field.type]
      if (customType) {
        draft[templateId].fields[index] = {
          ...customType,
          ...field,
          type: customType.type,
        }
      }
    })
  })
}

function fixContent(content, draft, templates) {
  const { template, ...allEntries } = content
  const { fields = [], fixedChildren = [], children = [] } = utils.getTemplate(template, templates)

  // fix invalid fields
  fields.forEach((field) => {
    if (!utils.isValidField(content[field.id], field)) {
      if (utils.isLocalizedField(field)) {
        draft[field.id] = {}
        for (const locale of field.localization) {
          const originalValue = content[field.id] && content[field.id][locale]
          if (utils.isValidFieldValue(originalValue, field)) {
            draft[field.id][locale] = originalValue
          } else {
            draft[field.id][locale] = utils.createFieldValue(field)
          }
        }
      } else {
        draft[field.id] = utils.createFieldValue(field)
      }
    }
  })

  // fix fixedChildren
  fixedChildren.forEach((child) => {
    if (!isPlainObject(content[child.id])) {
      draft[child.id] = utils.createChildValue(child.template, templates)
    } else {
      fixContent(content[child.id], draft[child.id], templates)
    }
  })

  // fix additional children
  const namedEntries = [...fields, ...fixedChildren].map(({ id }) => id)
  const additionalChildIds = Object.keys(allEntries).filter((id) => !namedEntries.includes(id))
  additionalChildIds.forEach((id) => {
    const child = content[id]

    if (utils.isUntemplatedEntry(child)) {
      // leave children without a template untouched, they are not managed by the ACMS UI
      return
    }

    if (!isPlainObject(child) || !children.includes(child.template)) {
      // delete children with invalid template
      delete draft[id]
    } else {
      fixContent(child, draft[id], templates)
    }
  })
}

export function saveData(acmsApi, acmsConfigPath) {
  return async (dispatch, getState) => {
    const state = getState()
    const version = getVersion(state)
    const content = getChangedContent(state)
    const templates = selectTemplates(state)
    const contentPath = getContentPath(state)
    const originalFiles = getContentFiles(state)

    try {
      dispatch({ type: "START_SAVING" })

      const contentFiles = toFiles(content, templates, originalFiles)
      await acmsApi.save(contentFiles, contentPath, version)

      dispatch(loadData(acmsApi, acmsConfigPath))
    } catch (error) {
      dispatch(showError("Failed to save Data", error.stack))
    }
  }
}
