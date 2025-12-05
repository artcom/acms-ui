/* eslint-disable no-param-reassign */
import get from "lodash/get"
import isEqual from "lodash/isEqual"
import set from "lodash/set"
import unset from "lodash/unset"
import { createNextState, createReducer, original } from "@reduxjs/toolkit"
import resolveConfig from "./resolveConfig"

export const config = createReducer(null, (builder) => {
  builder.addCase("UPDATE_DATA", (draft, { payload }) => resolveConfig(payload.config))
})

export const acmsConfigPath = createReducer(null, (builder) => {
  builder.addCase("CONFIG_PATH", (draft, { payload }) => payload.path)
})

export const isSaving = createReducer(false, (builder) => {
  builder
    .addCase("START_SAVING", () => true)
    .addCase("UPDATE_DATA", () => false)
    .addCase("SHOW_ERROR", () => false)
})

export const version = createReducer(null, (builder) => {
  builder.addCase("UPDATE_DATA", (draft, { payload }) => payload.version)
})

export const templates = createReducer(null, (builder) => {
  builder.addCase("UPDATE_DATA", (draft, { payload }) => payload.templates)
})

export const originalContent = createReducer(null, (builder) => {
  builder.addCase("UPDATE_DATA", (draft, { payload }) => payload.originalContent)
})

export function changedContent(state = null, action) {
  switch (action.type) {
    case "UPDATE_DATA":
      return action.payload.changedContent
    case "SET_VALUE": {
      const { path, value, originalContent } = action.payload
      const newState = createNextState(state, (draft) => {
        set(draft, path, value)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "FINISH_ENTITY_CREATION": {
      const { path, values, originalContent } = action.payload
      const newState = createNextState(state, (draft) => {
        set(draft, path, values)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "FINISH_ENTITY_RENAMING": {
      const { oldId, newId, path, originalContent } = action.payload
      if (oldId === newId) {
        return
      }

      const newState = createNextState(state, (draft) => {
        const oldPath = [...path, oldId]
        const newPath = [...path, newId]
        set(draft, newPath, get(original(draft), oldPath))
        unset(draft, oldPath)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "DELETE_ENTITY": {
      const { path, originalContent } = action.payload
      const newState = createNextState(state, (draft) => {
        unset(draft, path)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    default:
      return state
  }
}

export const newEntity = createReducer(null, (builder) => {
  builder
    .addCase("START_ENTITY_CREATION", (draft, { payload }) => payload)
    .addCase("UPDATE_ENTITY_CREATION", (draft, { payload }) => {
      Object.entries(payload).forEach(([key, value]) => {
        draft[key] = value
      })
    })
    .addCase("FINISH_ENTITY_CREATION", () => null)
    .addCase("CANCEL_ENTITY_CREATION", () => null)
})

export const renamedEntity = createReducer(null, (builder) => {
  builder
    .addCase("START_ENTITY_RENAMING", (draft, { payload }) => payload)
    .addCase("UPDATE_ENTITY_RENAMING", (draft, { payload }) => {
      draft.newId = payload.newId
    })
    .addCase("FINISH_ENTITY_RENAMING", () => null)
    .addCase("CANCEL_ENTITY_RENAMING", () => null)
})

export const path = createReducer([], (builder) => {
  builder.addCase("UPDATE_PATH", (draft, { payload }) => payload.path)
})

export const flash = createReducer(null, (builder) => {
  builder.addCase("SHOW_ERROR", (draft, { payload }) => payload).addCase("HIDE_ERROR", () => null)
})

export const progress = createReducer({}, (builder) => {
  builder
    .addCase("START_UPLOAD", (draft, { payload }) => {
      draft[payload.path.toString()] = 0
    })
    .addCase("PROGRESS_UPLOAD", (draft, { payload }) => {
      draft[payload.path.toString()] = payload.progress
    })
    .addCase("SET_VALUE", (draft, { payload }) => {
      delete draft[payload.path.toString()]
    })
    .addCase("CANCEL_UPLOAD", (draft, { payload }) => {
      delete draft[payload.path.toString()]
    })
})

export const user = createReducer(null, (builder) => {
  builder.addCase("UPDATE_USER", (draft, { payload }) => payload.user)
})

export const search = createReducer("", (builder) => {
  builder.addCase("SET_SEARCH", (draft, { payload }) => payload.search)
})

// replaces the upmost ancestor which is deep equal to the original ancestor with the original
// content to ensure referential equality
function resetEqualAncestors(originalState, changedState, path) {
  // if the state value differs do nothing
  if (!isContentEqual(originalState, changedState, path)) {
    return changedState
  }

  // update ancestorPath with the upmost equal ancestors
  let ancestorPath = path
  while (ancestorPath.length > 0) {
    const parentPath = ancestorPath.slice(0, -1)
    if (!isContentEqual(originalState, changedState, parentPath)) {
      break
    } else {
      ancestorPath = parentPath
    }
  }

  // return the equal ancestor
  if (ancestorPath.length > 0) {
    return createNextState(changedState, (draft) => {
      set(draft, ancestorPath, get(originalState, ancestorPath))
    })
  } else {
    return originalState
  }
}

function isContentEqual(originalState, changedState, path) {
  if (path.length === 0) {
    return isEqual(originalState, changedState)
  } else {
    return isEqual(get(originalState, path), get(changedState, path))
  }
}
