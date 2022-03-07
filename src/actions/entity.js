import startCase from "lodash/startCase"
import camelCase from "lodash/camelCase"
import padStart from "lodash/padStart"

import {
  selectNewEntityPath,
  selectNewEntityValues,
  getPath,
  selectRenamedEntity,
  selectTemplateChildren
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
        templates
      }
    })
  }
}

function findNextIndex(children, templateName) {
  const nextIndexInvalid = (cs, nIndex) => cs.some(child => {
    const templateMatch = child.name.toLowerCase().startsWith(templateName)
    let indexEquals = false
    const indexStringMatch = child.name.match(/(\d+)$/g)
    if (indexStringMatch) {
      const indexString = indexStringMatch.pop()
      if (indexString) {
        indexEquals = nIndex === Number.parseInt(indexString, 10)
      }
    }
    return templateMatch && indexEquals
  })
  const startIndex = 1
  let nextIndex = startIndex
  while (nextIndexInvalid(children, nextIndex)) {
    nextIndex++
  }
  // console.log("found next ID", nextIndex)
  return nextIndex
}

export function startNumberedEntityCreation(children) {
  return (dispatch, getState) => {
    const state = getState()
    const templates = selectTemplateChildren(state)
    let id = ""
    if (templates.length === 1) {
      const templateName = templates[0].split("/").slice(-1).toString().toLowerCase()
      const nextIndex = findNextIndex(children, templateName)
      id = `${startCase(templateName)} ${padStart(nextIndex, 3, "0")}`
    }
    dispatch({
      type: "START_ENTITY_CREATION",
      payload: {
        id,
        template: templates[0],
        templates
      }
    })
  }
}


export function updateEntityCreationId(id) {
  return {
    type: "UPDATE_ENTITY_CREATION",
    payload: {
      id
    }
  }
}

export function updateEntityCreationTemplate(template) {
  return {
    type: "UPDATE_ENTITY_CREATION",
    payload: {
      template
    }
  }
}

export function finishEntityCreation() {
  return (dispatch, getState) => {
    const state = getState()

    dispatch({
      type: "FINISH_ENTITY_CREATION",
      payload: {
        path: selectNewEntityPath(state),
        values: selectNewEntityValues(state)
      }
    })
  }
}

export function cancelEntityCreation() {
  return {
    type: "CANCEL_ENTITY_CREATION"
  }
}

export function startEntityRenaming(oldId) {
  return {
    type: "START_ENTITY_RENAMING",
    payload: {
      oldId,
      newId: startCase(oldId)
    }
  }
}

export function updateEntityRenaming(newId) {
  return {
    type: "UPDATE_ENTITY_RENAMING",
    payload: {
      newId
    }
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
        newId: camelCase(newId)
      }
    })
  }
}

export function cancelEntityRenaming() {
  return {
    type: "CANCEL_ENTITY_RENAMING"
  }
}

export function deleteEntity(path) {
  return {
    type: "DELETE_ENTITY",
    payload: {
      path
    }
  }
}
