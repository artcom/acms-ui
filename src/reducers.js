/* eslint-disable no-param-reassign */
import { original, produce } from "immer"
import { createReducer } from "@reduxjs/toolkit"
import get from "lodash/get"
import set from "lodash/set"
import unset from "lodash/unset"

import resolveConfig from "./resolveConfig"

export const config = createReducer(null, {
  UPDATE_DATA: (state, { payload }) => resolveConfig(payload.config),
})

export const isSaving = createReducer(false, {
  START_SAVING: () => true,
  UPDATE_DATA: () => false,
  SHOW_ERROR: () => false,
})

export const version = createReducer(null, {
  UPDATE_DATA: (state, { payload }) => payload.version,
})

export const templates = createReducer(null, {
  UPDATE_DATA: (state, { payload }) => payload.templates,
})

export const originalContent = createReducer(null, {
  UPDATE_DATA: (state, { payload }) => payload.originalContent,
})

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
  }
}, null)

export const changedContentReducer = createReducer(null, {
  UPDATE_DATA: (state, { payload }) => payload.changedContent,
  SET_VALUE: (state, { payload }) => set(original(state), payload.path, payload.value),
  UNDO_CHANGES: (state, { payload }) => set(original(state), payload.path, payload.originalValue),
  FINISH_ENTITY_CREATION: (state, { payload }) =>
    set(original(state), payload.path, payload.values),
  FINISH_ENTITY_RENAMING: (state, { payload }) => {
    const oldPath = [...payload.path, payload.oldId]
    const newPath = [...payload.path, payload.newId]
    set(original(state), newPath, get(original(state), oldPath))
    unset(original(state), oldPath)
  },
  DELETE_ENTITY: (state, { payload }) => unset(original(state), payload.path),
})


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

export const newEntityReducer = createReducer(null, {
  START_ENTITY_CREATION: (state, { payload }) => payload,
  UPDATE_ENTITY_CREATION: (state, { payload }) => payload,
  FINISH_ENTITY_CREATION: () => null,
  CANCEL_ENTITY_CREATION: () => null,
})

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

export const renamedEntityReducer = createReducer(null, {
  START_ENTITY_RENAMING: (state, { payload }) => payload,
  UPDATE_ENTITY_RENAMING: (state, { payload }) => ({ ...state, newId: payload.newId }),
  FINISH_ENTITY_RENAMING: () => null,
  CANCEL_ENTITY_RENAMING: () => null,
})


export const path = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_PATH":
      return payload.path
  }
}, [])

export const pathReducer = createReducer([], {
  UPDATE_PATH: (state, { payload }) => payload.path,
})

export const flash = produce((draft, { type, payload }) => {
  switch (type) {
    case "SHOW_ERROR":
      return payload
    case "HIDE_ERROR":
      return null
  }
}, null)

export const flashReducer = createReducer(null, {
  SHOW_ERROR: (state, { payload }) => payload,
  HIDE_ERROR: () => null,
})


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

export const progressReducer = createReducer({}, {
  START_UPLOAD: (state, { payload }) => ({ ...state, [payload.path.toString()]: 0 }),
  PROGRESS_UPLOAD: (state, { payload }) =>
    ({ ...state, [payload.path.toString()]: payload.progress }),
  SET_VALUE: (state, { payload }) => {
    delete state[payload.path.toString()]
    return state
  },
  CANCEL_UPLOAD: (state, { payload }) => {
    delete state[payload.path.toString()]
    return state
  },
})


export const user = produce((draft, { type, payload }) => {
  switch (type) {
    case "UPDATE_USER":
      return payload.user
  }
}, null)

export const userReducer = createReducer(null, {
  UPDATE_USER: (state, { payload }) => payload.user,
})
