/* eslint-disable no-param-reassign */

import { createNextState } from "@reduxjs/toolkit"
import normalizeUrl from "normalize-url"
import isPlainObject from "lodash/isPlainObject"
import { useSelector } from "react-redux"
import path from "path-browserify"
import { getChangedContent, selectTemplates, getVersion, getContentPath } from "../selectors"
import { showError } from "./error"
import * as utils from "../utils"

export function loadData(acmsApi, acmsConfigPath) {
  return async (dispatch) => {
    try {
      const { data: config, version } = await acmsApi.queryJson(acmsConfigPath)
      const [{ data: templates }, { data: originalContent }] = await Promise.all([
        acmsApi.queryFiles(config.templatesPath, version),
        acmsApi.queryJson(config.contentPath, version),
      ])
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

function fixContent(content, draft, templates) {
  const { template, ...allEntries } = content
  const { fields = [], fixedChildren = [], children = [] } = utils.getTemplate(template, templates)

  // fix invalid fields
  fields.forEach((field) => {
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
      const mediaFields = getTemplateMediaFields(templates)
      getAssetsInUse(contentFiles, templates)

      console.log("CONTENT FILES", contentFiles)
      console.log("TEMPLATES", templates)
      console.log("MEDIA FIELDS", mediaFields)
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
  const childIds = Object.keys(content).filter((id) => !fieldIds.includes(id))
  childIds.forEach((id) => Object.assign(files, toFiles(content[id], templates, [...path, id])))

  return files
}

function getTemplateMediaFields(templates) {
  console.log("TEMPLATES", templates)
  const result = []
  Object.keys(templates).forEach(key => {
    const template = templates[key]

    const mediaFields = template.fields.filter(field =>
      field.type === "image" ||
      field.type === "video" ||
      field.type === "audio" ||
      field.type === "file"
    ).map(field => {
      const id = key.endsWith("/index") ? key.substring(0, key.length - 6) : key
      return {
        templateIdOriginal: key,
        templateIdActual: id,
        fieldId: field.id,
        fieltType: field.type
      }
    })
    result.push(...mediaFields)
  })
  return result
}

export function getAssetsInUse(acmsAssets) {
  return async (dispatch, getState) => {
    const state = getState()
    const content = getChangedContent(state)
    const templates = selectTemplates(state)
    const mediaFields = getTemplateMediaFields(templates)
    const allAssets = await acmsAssets.listAllFiles("")
    console.log("ALL ASSETS inside", allAssets)
    try {
      const contentFiles = toFiles(content, templates)
      const contentFileArray = Object.keys(contentFiles).map(key => contentFiles[key])

      const result = allAssets.map(entry => {
        // const uri = simpleNormalizeURL(acmsAssets.url, entry.path)
        const base = acmsAssets.url
        // const uri = base.substring(0, base.length - 1) + entry.path
        const uriOld = `${base}/${entry.path}`

        const uri = normalizeUrl(uriOld)
        return {
          ...entry,
          useCount: 0,
          uri
        }
      })
      contentFileArray.forEach(contentFile => {
        const contentMediaFields = mediaFields.filter(mediaField =>
          contentFile.template === mediaField.templateIdActual)
        contentMediaFields.forEach(mediaField => {
          const uri = contentFile[mediaField.fieldId]
          const existingEntry = result.find(item => item.uri === uri)
          if (existingEntry) {
            existingEntry.useCount = existingEntry.useCount + 1
          }
        })
      })
      console.log("ASSETS IN USE", result)
      return result
    } catch (error) {
      dispatch(showError("Failed to get Assets in Use", error.stack))
    }
  }
}
