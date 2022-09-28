/* eslint-disable no-param-reassign */
import get from "lodash/get"
import isEqual from "lodash/isEqual"
import set from "lodash/set"
import { produce } from "immer"
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

export function changedContent(state = null, action) {
  switch (action.type) {
    case "UPDATE_DATA":
      return action.payload.changedContent
    case "SET_VALUE": {
      const { path, value, originalContent } = action.payload
      const newState = produce(state, (draft) => {
        set(draft, path, value)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "FINISH_ENTITY_CREATION": {
      const { path, values, originalContent } = action.payload
      const newState = produce(state, (draft) => {
        set(draft, path, values)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "FINISH_ENTITY_RENAMING": {
      const { oldId, newId, path, originalContent } = action.payload
      if (oldId === newId) {
        return
      }

      const newState = produce(state, (draft) => {
        const oldPath = [...path, oldId]
        const newPath = [...path, newId]
        set(draft, newPath, get(original(draft), oldPath))
        unset(draft, oldPath)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    case "DELETE_ENTITY": {
      const { path, originalContent } = action.payload
      const newState = produce(state, (draft) => {
        unset(draft, path)
      })

      return resetEqualAncestors(originalContent, newState, path)
    }
    default:
      return state
  }
}

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

export const search = createReducer("", {
  SET_SEARCH: (draft, { payload }) => payload.search,
})

// replaces the upmost ancestors which is deep equal with the original content with the
// original content to ensure referential equality
function resetEqualAncestors(originalState, changedState, path) {
  // if the state value differs do nothing
  if (!isContentEqual(originalState, changedState, path)) {
    return changedState
  }

  // if the direct ancestor differs do nothing
  let ancestorPath = path.slice(0, -1)
  if (!isContentEqual(originalState, changedState, ancestorPath)) {
    return changedState
  }

  // update ancestorPath with the upmost equal ancestors
  while (ancestorPath.length > 0) {
    const parentPath = ancestorPath.slice(0, -1)
    if (!isContentEqual(originalState, changedState, parentPath)) {
      break
    } else {
      ancestorPath = parentPath
    }
  }

  // return the resetted state
  if (ancestorPath.length > 0) {
    return produce(changedState, (draft) => {
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
