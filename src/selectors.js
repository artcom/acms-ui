import Immutable from "immutable"
import mapValues from "lodash/mapValues"
import { createSelector } from "reselect"

import { camelCase } from "lodash"
import { evaluate } from "./condition"
import { isLocalized } from "./language"
import { isWhitelisted } from "./whitelist"
import * as utils from "./utils"

const TEMPLATE_KEY = "template"

export const getVersion = state => state.version
export const getOriginalContent = state => state.originalContent
export const getChangedContent = state => state.changedContent
export const getLanguages = state => state.languages
export const getProgress = state => state.progress
export const getWhitelist = state => state.user.whiteList
export const getFilePath = state => state.path

export const getTemplates = state => mapValues(state.templates, template => ({
  fields: [],
  children: [],
  fixedChildren: [],
  ...template
}))

export const getNewEntity = state => {
  if (!state.newEntity) {
    return {
      isVisible: false,
      id: "",
      templates: []
    }
  }

  return { ...state.newEntity,
    isValidId: validateEntityId(state.newEntity.id),
    isVisible: true
  }
}

export const getRenamedEntity = state => {
  if (!state.renamedEntity) {
    return {
      isVisible: false,
      newId: ""
    }
  }

  return { ...state.renamedEntity,
    isValidId: validateEntityId(state.renamedEntity.newId),
    isVisible: true
  }
}

function validateEntityId(id) {
  return id.length > 0
}

export const getNewEntityPath = createSelector(
  [getNewEntity, getFilePath],
  (newEntity, path) => [...path, camelCase(newEntity.id)]
)

export const getNewEntityValues = createSelector(
  [getNewEntity, getTemplates],
  (newEntity, templates) => Immutable.fromJS(utils.createEntry(newEntity, templates))
)

export const getFieldLocalization = state => {
  if (!state.fieldLocalization) {
    return {
      languageIds: new Immutable.OrderedMap(),
      isVisible: false
    }
  }

  return { ...state.fieldLocalization,
    isVisible: true
  }
}

export const getOriginalEntity = createSelector(
  [getOriginalContent, getFilePath],
  (originalContent, path) => originalContent.getIn(path, new Immutable.Map())
)

export const getChangedEntity = createSelector(
  [getChangedContent, getFilePath],
  (changedContent, path) => changedContent.getIn(path)
)

export const getOriginalValues = createSelector(
  [getOriginalEntity],
  originalEntity => new Immutable.Map(originalEntity.toJS())
)

export const getChangedValues = createSelector(
  [getChangedEntity],
  changedEntity => new Immutable.Map(changedEntity.toJS())
)

export const getTemplate = createSelector(
  [getTemplates, getChangedValues],
  (templates, changedValues) =>
    utils.getTemplate(changedValues.get(TEMPLATE_KEY), templates)
)

export const getTemplateChildren = createSelector(
  [getTemplate],
  template => template.children
)

export const getTemplateFixedChildren = createSelector(
  [getTemplate],
  template => template.fixedChildren
)

const getFields = createSelector(
  [getTemplate, getOriginalValues, getChangedValues, getFilePath, getLanguages, getProgress],
  (template, originalValues, changedValues, path, languages, progress) => template.fields
    .filter(field => !field.condition || evaluate(field.condition, changedValues))
    .map(field => {
      const originalValue = originalValues.get(field.id)
      const changedValue = changedValues.get(field.id)
      const fieldPath = [...path, field.id]

      return { ...field,
        hasChanged: !Immutable.is(originalValue, changedValue),
        isLocalized: isLocalized(changedValue, languages),
        path: fieldPath,
        value: changedValue,
        progress: progress.get(fieldPath.toString())
      }
    })
)

export const getWhitelistedFields = createSelector(
  [getFields, getWhitelist],
  (fields, whitelist) => fields.filter(field => isWhitelisted(whitelist, field.path))
)

const getChildren = createSelector(
  [getTemplate, getOriginalEntity, getChangedEntity, getFilePath],
  (template, originalEntity, changedEntity, path) => {
    const childIds = new Immutable.Set(originalEntity.keySeq().concat(changedEntity.keySeq()))
    const fieldIds = template.fields.map(({ id }) => id)
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return childIds
      .filter(
        id => id !== TEMPLATE_KEY &&
        !fieldIds.includes(id) &&
        !fixedChildIds.includes(id))
      .sort()
      .map(id => ({
        hasChanged: !Immutable.is(originalEntity.get(id), changedEntity.get(id)),
        isNew: !originalEntity.has(id),
        isDeleted: !changedEntity.has(id),
        id,
        path: [...path, id]
      }))
  }
)

export const getWhitelistedChildren = createSelector(
  [getChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)

const getFixedChildren = createSelector(
  [getTemplate, getOriginalEntity, getChangedEntity, getFilePath],
  (template, originalEntity, changedEntity, path) => {
    const childIds = new Immutable.Set(originalEntity.keySeq().concat(changedEntity.keySeq()))
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return childIds
      .filter(id => fixedChildIds.includes(id))
      .sort()
      .map(id => ({
        hasChanged: !Immutable.is(originalEntity.get(id), changedEntity.get(id)),
        isNew: !originalEntity.has(id),
        isDeleted: !changedEntity.has(id),
        id,
        path: [...path, id]
      }))
  }
)

export const getWhitelistedFixedChildren = createSelector(
  [getFixedChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)
