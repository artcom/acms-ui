/* eslint-disable no-param-reassign */
import { original, produce } from "immer"
import isUndefined from "lodash/isUndefined"
import get from "lodash/get"
import set from "lodash/set"
import unset from "lodash/unset"

import { createFieldValue } from "./utils"

export const config = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config
  }
}, null)

export const isSaving = produce((draft, { type }) => {
  switch (type) {
    case "START_SAVING":
      return true

    case "UPDATE_DATA":
    case "SHOW_ERROR":
      return false
  }
}, false)

export const version = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.version
  }
}, null)

export const templates = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.templates
  }
}, null)

export const originalContent = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.originalContent
  }
}, null)

export const changedContent = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.changedContent

    case "SET_VALUE":
      set(draft, payload.path, payload.value)
      break
    case "UNDO_CHANGES":
      set(draft, payload.path, payload.originalValue)
      break
    case "FINISH_ENTITY_CREATION":
      set(draft, payload.path, payload.values)
      break
    case "FINISH_ENTITY_RENAMING": {
      const oldPath = [...payload.path, payload.oldId]
      const newPath = [...payload.path, payload.newId]
      set(draft, newPath, get(original(draft), oldPath))
      unset(draft, oldPath)
    } break
    case "DELETE_ENTITY":
      unset(draft, payload.path)
      break
    case "FINISH_FIELD_LOCALIZATION": {
      // eslint-disable-next-line no-shadow
      const { defaultLanguageId, fieldLocalization } = payload
      const { field, languageIds } = fieldLocalization
      const selectedLanguageIds = Object.keys(languageIds).filter(id => languageIds[id])
      const shouldBeLocalized = selectedLanguageIds.length > 1

      if (field.isLocalized) {
        if (shouldBeLocalized) {
          // Update localization
          const newValue = {}
          for (const id of selectedLanguageIds) {
            newValue[id] = isUndefined(field.value[id]) ? createFieldValue(field) : field.value[id]
          }
          set(draft, field.path, newValue)
        } else {
          // Unlocalize field
          const defaultLanguageValue = get(original(draft), [...field.path, defaultLanguageId])
          set(draft, field.path, defaultLanguageValue)
        }
      } else {
        if (shouldBeLocalized) {
          // Localize field
          const newValue = {}
          for (const id of selectedLanguageIds) {
            newValue[id] = id === defaultLanguageId ? field.value : createFieldValue(field)
          }
          set(draft, field.path, newValue)
        }
      }
    }
  }
}, null)

export const newEntity = produce((draft, { type, payload }) => {
  switch (type) {
    case "START_ENTITY_CREATION":
      return payload

    case "UPDATE_ENTITY_CREATION":
      Object.entries(payload).forEach(([key, value]) => { draft[key] = value })
      break
    case "FINISH_ENTITY_CREATION":
    case "CANCEL_ENTITY_CREATION":
      return null
  }
}, null)

export const renamedEntity = produce((draft, { type, payload }) => {
  switch (type) {
    case "START_ENTITY_RENAMING":
      return payload

    case "UPDATE_ENTITY_RENAMING":
      draft.newId = payload.newId
      break
    case "FINISH_ENTITY_RENAMING":
    case "CANCEL_ENTITY_RENAMING":
      return null
  }
}, null)

export const fieldLocalization = produce((draft, { type, payload }) => {
  switch (type) {
    case "START_FIELD_LOCALIZATION":
      return payload

    case "UPDATE_FIELD_LOCALIZATION":
      draft.languageIds[payload.languageId] = payload.hasLocalization
      break
    case "FINISH_FIELD_LOCALIZATION":
    case "CANCEL_FIELD_LOCALIZATION":
      return null
  }
}, null)

export const path = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_PATH":
      return payload.path
  }
}, [])

export const flash = produce((draft, { type, payload }) => {
  switch (type) {
    case "SHOW_ERROR":
      return payload
    case "HIDE_ERROR":
      return null
  }
}, null)

export const progress = produce((draft, { type, payload }) => {
  switch (type) {
    case "START_UPLOAD":
      draft[payload.path.toString()] = 0
      break
    case "PROGRESS_UPLOAD":
      draft[payload.path.toString()] = payload.progress
      break
    case "SET_VALUE":
    case "CANCEL_UPLOAD":
      delete draft[payload.path.toString()]
      break
  }
}, {})

export const user = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_USER":
      return payload.user
  }
}, null)
