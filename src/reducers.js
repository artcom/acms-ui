/* eslint-disable no-param-reassign */
import get from "lodash/get"
import set from "lodash/set"
import unset from "lodash/unset"
import { createReducer, original } from "@reduxjs/toolkit"
import resolveConfig from "./resolveConfig"

export const config = createReducer(null, {
  UPDATE_DATA: (draft, { payload }) => resolveConfig(payload.config),
})

export const acmsConfigPath = createReducer(null, {
  CONFIG_PATH: (draft, { payload }) => payload.path,
})

export const isSaving = createReducer(false, {
  START_SAVING: () => true,
  UPDATE_DATA: () => false,
  SHOW_ERROR: () => false,
})

export const version = createReducer(null, {
  UPDATE_DATA: (draft, { payload }) => payload.version,
})

export const templates = createReducer(null, {
  UPDATE_DATA: (draft, { payload }) => payload.templates,
})

export const originalContent = createReducer(null, {
  UPDATE_DATA: (draft, { payload }) => payload.originalContent,
})

export const changedContent = createReducer(null, {
  UPDATE_DATA: (draft, { payload }) => payload.changedContent,
  SET_VALUE: (draft, { payload }) => {
    set(draft, payload.path, payload.value)
  },
  UNDO_CHANGES: (draft, { payload }) => {
    set(draft, payload.path, payload.originalValue)
  },
  FINISH_ENTITY_CREATION: (draft, { payload }) => {
    set(draft, payload.path, payload.values)
  },
  FINISH_ENTITY_RENAMING: (draft, { payload }) => {
    const oldPath = [...payload.path, payload.oldId]
    const newPath = [...payload.path, payload.newId]
    set(draft, newPath, get(original(draft), oldPath))
    unset(draft, oldPath)
  },
  DELETE_ENTITY: (draft, { payload }) => {
    unset(draft, payload.path)
  },
})

export const newEntity = createReducer(null, {
  START_ENTITY_CREATION: (draft, { payload }) => payload,
  UPDATE_ENTITY_CREATION: (draft, { payload }) => {
    Object.entries(payload).forEach(([key, value]) => {
      draft[key] = value
    })
  },
  FINISH_ENTITY_CREATION: () => null,
  CANCEL_ENTITY_CREATION: () => null,
})

export const renamedEntity = createReducer(null, {
  START_ENTITY_RENAMING: (draft, { payload }) => payload,
  UPDATE_ENTITY_RENAMING: (draft, { payload }) => {
    draft.newId = payload.newId
  },
  FINISH_ENTITY_RENAMING: () => null,
  CANCEL_ENTITY_RENAMING: () => null,
})

export const path = createReducer([], {
  UPDATE_PATH: (draft, { payload }) => payload.path,
})

export const flash = createReducer(null, {
  SHOW_ERROR: (draft, { payload }) => payload,
  HIDE_ERROR: () => null,
})

export const progress = createReducer(
  {},
  {
    START_UPLOAD: (draft, { payload }) => {
      draft[payload.path.toString()] = 0
    },
    PROGRESS_UPLOAD: (draft, { payload }) => {
      draft[payload.path.toString()] = payload.progress
    },
    SET_VALUE: (draft, { payload }) => {
      delete draft[payload.path.toString()]
    },
    CANCEL_UPLOAD: (draft, { payload }) => {
      delete draft[payload.path.toString()]
    },
  }
)

export const user = createReducer(null, {
  UPDATE_USER: (draft, { payload }) => payload.user,
})
