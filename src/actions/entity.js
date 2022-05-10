import startCase from "lodash/startCase"
import camelCase from "lodash/camelCase"

import {
  selectNewEntityPath,
  selectNewEntityValues,
  getPath,
  selectRenamedEntity,
  selectTemplateChildren,
} from "../selectors"

export function startEntityCreation() {
  return (dispatch, getState) => {
    const state = getState()
    const templates = selectTemplateChildren(state)

    dispatch({
      type: "START_ENTITY_CREATION",
      payload: {
        id: "",
        template: templates[0],
        templates,
      },
    })
  }
}

export function updateEntityCreationId(id) {
  return {
    type: "UPDATE_ENTITY_CREATION",
    payload: {
      id,
    },
  }
}

export function updateEntityCreationTemplate(template) {
  return {
    type: "UPDATE_ENTITY_CREATION",
    payload: {
      template,
    },
  }
}

export function finishEntityCreation() {
  return (dispatch, getState) => {
    const state = getState()

    dispatch({
      type: "FINISH_ENTITY_CREATION",
      payload: {
        path: selectNewEntityPath(state),
        values: selectNewEntityValues(state),
      },
    })
  }
}

export function cancelEntityCreation() {
  return {
    type: "CANCEL_ENTITY_CREATION",
  }
}

export function startEntityRenaming(oldId) {
  return {
    type: "START_ENTITY_RENAMING",
    payload: {
      oldId,
      newId: startCase(oldId),
    },
  }
}

export function updateEntityRenaming(newId) {
  return {
    type: "UPDATE_ENTITY_RENAMING",
    payload: {
      newId,
    },
  }
}

export function finishEntityRenaming() {
  return (dispatch, getState) => {
    const state = getState()
    const { oldId, newId } = selectRenamedEntity(state)

    dispatch({
      type: "FINISH_ENTITY_RENAMING",
      payload: {
        path: getPath(state),
        oldId,
        newId: camelCase(newId),
      },
    })
  }
}

export function cancelEntityRenaming() {
  return {
    type: "CANCEL_ENTITY_RENAMING",
  }
}

export function deleteEntity(path) {
  return {
    type: "DELETE_ENTITY",
    payload: {
      path,
    },
  }
}
