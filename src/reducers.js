/* eslint-disable no-param-reassign */
import { original, produce } from "immer"
import isUndefined from "lodash/isUndefined"
import get from "lodash/get"
import set from "lodash/set"
import unset from "lodash/unset"

import { createFieldValue } from "./utils"

export function isSaving(state = false, { type }) {
  switch (type) {
    case "START_SAVING":
      return true

    case "UPDATE_DATA":
    case "SHOW_ERROR":
      return false

    default:
      return state
  }
}

export function version(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.version

    default:
      return state
  }
}

export function languages(state = [], { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config.languages || []

    default:
      return state
  }
}

export function contentPath(state = "", { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config.contentPath

    default:
      return state
  }
}

export function templates(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.templates

    default:
      return state
  }
}

export function title(state = "", { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config.title || ""

    default:
      return state
  }
}

export function originalContent(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.originalContent

    default:
      return state
  }
}

export const changedContent = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_DATA":
      return payload.changedContent

    case "CHANGE_VALUE":
      set(draft, payload.path, payload.value)
      break
    case "UNDO_CHANGES":
      if (isUndefined(payload.originalValue)) {
        unset(draft, payload.path)
      } else {
        set(draft, payload.path, payload.originalValue)
      }
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
          const values = {}
          for (const id of selectedLanguageIds) {
            values[id] = isUndefined(field.value[id]) ? createFieldValue(field) : field.value[id]
          }
          set(draft, field.path, values)
        } else {
          // Unlocalize field
          const defaultLanguageValue = get(original(draft), [...field.path, defaultLanguageId])
          set(draft, field.path, defaultLanguageValue)
        }
      } else {
        if (shouldBeLocalized) {
          // Localize field
          const values = {}
          for (const id of selectedLanguageIds) {
            values[id] = id === defaultLanguageId ? field.value : createFieldValue(field)
          }
          set(draft, field.path, values)
        }
      }
    }
  }
}, null)

export function newEntity(state = null, { type, payload }) {
  switch (type) {
    case "START_ENTITY_CREATION":
      return payload

    case "UPDATE_ENTITY_CREATION":
      return { ...state, ...payload }

    case "FINISH_ENTITY_CREATION":
    case "CANCEL_ENTITY_CREATION":
      return null

    default:
      return state
  }
}

export function renamedEntity(state = null, { type, payload }) {
  switch (type) {
    case "START_ENTITY_RENAMING":
      return payload

    case "UPDATE_ENTITY_RENAMING":
      return { ...state, newId: payload.newId }

    case "FINISH_ENTITY_RENAMING":
    case "CANCEL_ENTITY_RENAMING":
      return null

    default:
      return state
  }
}

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

export function path(state = [], { type, payload }) {
  switch (type) {
    case "UPDATE_PATH":
      return payload.path

    default:
      return state
  }
}

export function flash(state = null, { type, payload }) {
  switch (type) {
    case "SHOW_ERROR":
      return payload

    case "HIDE_ERROR":
      return null

    default:
      return state
  }
}

export const progress = produce((draft, { type, payload }) => {
  switch (type) {
    case "START_UPLOAD":
      draft[payload.path.toString()] = 0
      break
    case "PROGRESS_UPLOAD":
      draft[payload.path.toString()] = payload.progress
      break
    case "CHANGE_VALUE":
    case "CANCEL_UPLOAD":
      delete draft[payload.path.toString()]
      break
  }
}, {})

const defaultUser = { name: "default", whiteList: ["**"] }

export function user(state = defaultUser, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA": {
      const users = payload.config.users
      const params = queryParams()

      if (users) {
        return params.user
          ? users[params.user] || defaultUser
          : Object.values(users)[0]
      } else {
        return defaultUser
      }
    }
    default:
      return state
  }
}

function queryParams() {
  const queryString = window.location.search.substring(1)
  return queryString.split("&").reduce((params, pair) => {
    const [key, value] = pair.split("=")
    return { ...params, [decodeURIComponent(key)]: decodeURIComponent(value) }
  }, {})
}
