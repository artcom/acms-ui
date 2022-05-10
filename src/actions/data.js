/* eslint-disable no-param-reassign */

import { createNextState } from "@reduxjs/toolkit"
import isPlainObject from "lodash/isPlainObject"
import { getChangedContent, selectTemplates, getVersion, getContentPath } from "../selectors"
import { showError } from "./error"
import * as utils from "../utils"

export function loadData(acmsApi, acmsConfigPath) {
  return async dispatch => {
    try {
      const { data: config, version } = await acmsApi.queryJson(acmsConfigPath)
      const [{ data: templates }, { data: originalContent }] = await Promise.all([
        acmsApi.queryFiles(config.templatesPath, version),
        acmsApi.queryJson(config.contentPath, version)
      ])

      const changedContent = createNextState(originalContent,
        draft => fixContent(originalContent, draft, templates)
      )

      dispatch({
        type: "UPDATE_DATA",
        payload: {
          config,
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

function fixContent(content, draft, templates) {
  const { template, ...allEntries } = content
  const { fields = [], fixedChildren = [], children = [] } = utils.getTemplate(template, templates)

  // fix invalid fields
  fields.forEach(field => {
    if (field.localization) {
      draft[field.id] = {}
      for (const id of field.localization) {
        const value = content[field.id][id]
        if (utils.isValidField(value, field)) {
          draft[field.id][id] = value
        } else {
          draft[field.id][id] = utils.createFieldValue(field)
        }
      }
    } else {
      if (!utils.isValidField(content[field.id], field)) {
        draft[field.id] = utils.createFieldValue(field)
      }
    }
  })

  // fix fixedChildren
  fixedChildren.forEach(child => {
    if (!isPlainObject(content[child.id])) {
      draft[child.id] = utils.createChildValue(child.template, templates)
    } else {
      fixContent(content[child.id], draft[child.id], templates)
    }
  })

  // fix additional children
  const namedEntries = [...fields, ...fixedChildren].map(({ id }) => id)
  const additionalChildIds = Object.keys(allEntries).filter(id => !namedEntries.includes(id))
  additionalChildIds.forEach(id => {
    if (!children.includes(content[id].template)) {
      // delete children with invalid template
      delete draft[id]
    } else {
      fixContent(content[id], draft[id], templates)
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
