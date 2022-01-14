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

export const user = createReducer(null, builder => {
  builder.addCase("UPDATE_USER", (state, action) => action.payload.user)
})

export const isSaving = createReducer(false, builder => {
  builder.addCase("START_SAVING", () => true)
  builder.addCase("UPDATE_DATA", () => false)
  builder.addCase("SHOW_ERROR", () => false)
})

export const version = createReducer(null, builder => {
  builder.addCase("UPDATE_DATA", (state, action) => action.payload.version)
})

export const templates = createReducer(null, builder => {
  builder.addCase("UPDATE_DATA", (state, action) => action.payload.templates)
})

export const path = createReducer(null, builder => {
  builder.addCase("UPDATE_PATH", (state, action) => action.payload.path)
})

export const flash = createReducer(null, builder => {
  builder
    .addCase("SHOW_ERROR", (state, action) => action.payload)
    .addCase("HIDE_ERROR", () => null)
})

export const originalContent = createReducer(null, builder => {
  builder.addCase("UPDATE_DATA", (state, action) => action.payload.originalContent)
})

// testing and code
export const changedContent = createReducer(null, builder => {
  builder
    .addCase("UPDATE_DATA", (state, action) => action.payload.changedContent)
    .addCase("SET_VALUE", (state, action) => {
      set(state, action.payload.path, action.payload.value)
    })
    .addCase("UNDO_CHANGES", (state, action) => {
      set(state, action.payload.path, action.payload.value)
    })
    .addCase("FINISH_ENTITY_CREATION", (state, action) => {
      set(state, action.payload.path, action.payload.value)
    })
    .addCase("FINISH_ENTITY_RENAMING", (state, action) => {
      set(state, action.payload.path, action.payload.value)
    })
    .addCase("DELETED_ENTITY", (state, action) => { unset(state, action.payload.path) })
})

// old to check new one works
export const changedContentOld = produce((draft, { type, payload }) => {
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

// test reducer
export const newEntityReducer = createReducer(null, builder => {
  builder.addCase("START_ENTITY_CREATION", (state, action) => action.payload.path)
  builder.addCase("UPDATE_ENTITY_CREATION", (state, action) =>
    Object.entries(action.payload).forEach(([key, value]) => { state[key] = value }))
  builder.addCase("FINISH_ENTITY_CREATION", () => null)
  builder.addCase("CANCEL_ENTITY_CREATION", () => null)
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


// test reducer
export const renamedEntityReducer = createReducer(null, {
  START_ENTITY_RENAMING: (state, { payload }) => payload,
  UPDATE_ENTITY_RENAMING: (state, { payload }) => ({ ...state, newId: payload.newId }),
  FINISH_ENTITY_RENAMING: () => null,
  CANCEL_ENTITY_RENAMING: () => null,
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

// test needed
export const progressReducer = createReducer(null, builder => {
  builder
    .addCase("START_UPLOAD", (state, action) => {
      state[action.payload.path.toString()] = 0
    })
    .addCase("PROGRESS_UPLOAD", (state, action) => {
      state[action.payload.path.toString()] = action.payload.progress
    })
    .addCase("CANCEL_UPLOAD", (state, action) => {
      delete state[action.payload.path.toString()]
    })
})

// old to check new one works
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

