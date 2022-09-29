/* eslint-disable no-param-reassign */

import { createNextState } from "@reduxjs/toolkit"
import isPlainObject from "lodash/isPlainObject"
import { getChangedContent, selectTemplates, getVersion, getContentPath } from "../selectors"
import { showError } from "./error"
import {
  createChildValue,
  createFieldValue,
  isValidField,
  isValidFieldValue,
  isLocalizedField,
} from "../utils/data"
import { getTemplate, validateTemplates } from "../utils/template"

export function loadData(acmsApi, acmsConfigPath) {
  return async (dispatch) => {
    try {
      const { data: config, version } = await acmsApi.queryJson(acmsConfigPath)
      const [{ data: templates }, { data: originalContent }] = await Promise.all([
        acmsApi.queryFiles(config.templatesPath, version),
        acmsApi.queryJson(config.contentPath, version),
      ])

      validateTemplates(templates)

      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )

      dispatch({
        type: "UPDATE_DATA",
        payload: {
          config,
          originalContent,
          changedContent,
          templates,
          version,
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

export function fixContent(content, draft, templates) {
  const { template, ...allEntries } = content
  const { fields = [], children = [] } = getTemplate(template, templates)

  // fix invalid fields
  fields.forEach((field) => {
    if (!isValidField(content[field.id], field)) {
      if (isLocalizedField(field)) {
        draft[field.id] = {}
        for (const locale of field.localization) {
          const originalValue = content[field.id][locale]
          if (isValidFieldValue(originalValue, field)) {
            draft[field.id][locale] = originalValue
          } else {
            draft[field.id][locale] = createFieldValue(field)
          }
        }
      } else {
        draft[field.id] = createFieldValue(field)
      }
    }
  })

  // fix children
  children.forEach((child) => {
    if (!isPlainObject(content[child.id])) {
      draft[child.id] = createChildValue(child.template, templates)
    } else {
      // fixChildren(content[child.id], draft[child.id], child.template, templates)
    }
  })

  // delete all unknown entries
  const knownIds = [...fields.map(({ id }) => id), ...children.map(({ id }) => id)]
  Object.keys(allEntries)
    .filter((id) => !knownIds.includes(id))
    .forEach((id) => delete draft[id])
}

// function fixChildren(content, draft, template, templates) {
//   if (Array.isArray(template)) {
//     fixChildren(content[child.id], draft[child.id], child.template, templates)
//   } else {
//     fixContent(content[child.id], draft[child.id], templates)
//   }
//   const childIds = Object.keys(content).sort()
//   for (const childId of childIds) {
//     fixContent(content[childId], draft[childId], templates)
//   }

//   // fix child indexes
//   childIds.forEach((childId, index) => {
//     // ensure no data is overwritten
//   })
// }

export function saveData(acmsApi, acmsConfigPath) {
  return async (dispatch, getState) => {
    const state = getState()
    const version = getVersion(state)
    const content = getChangedContent(state)
    const templates = selectTemplates(state)
    const contentPath = getContentPath(state)

    try {
      dispatch({ type: "START_SAVING" })

      const contentFiles = toFiles(content, templates)
      await acmsApi.save(contentFiles, contentPath, version)

      dispatch(loadData(acmsApi, acmsConfigPath))
    } catch (error) {
      dispatch(showError("Failed to save Data", error.stack))
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
  const childIds = Object.keys(content).filter((id) => !fieldIds.includes(id))
  childIds.forEach((id) => Object.assign(files, toFiles(content[id], templates, [...path, id])))

  return files
}
