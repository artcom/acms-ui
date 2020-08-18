import { createSelector } from "reselect"

import { camelCase, get, mapValues, isUndefined } from "lodash"
import { evaluate } from "./condition"
import { isLocalized } from "./language"
import { isWhitelisted } from "./whitelist"
import * as utils from "./utils"

const TEMPLATE_KEY = "template"

export const getVersion = state => state.version
export const getOriginalContent = state => state.originalContent
export const getChangedContent = state => state.changedContent
export const getLanguages = state => state.languages
export const getContentPath = state => state.contentPath
export const getProgress = state => state.progress
export const getWhitelist = state => state.user.whiteList
export const getPath = state => state.path
export const getNewEntity = state => state.newEntity
export const getRenamedEntity = state => state.renamedEntity
export const getTemplates = state => state.templates

export const selectTemplates = createSelector(
  [getTemplates],
  templates => mapValues(templates, template => ({
    fields: [],
    children: [],
    fixedChildren: [],
    ...template
  }))
)

export const selectChangedEntity = createSelector(
  [getChangedContent, getPath],
  (changedContent, path) => {
    const entity = path.length ? get(changedContent, path) : changedContent
    return entity
  }
)

export const selectNewEntity = createSelector(
  [getNewEntity, selectChangedEntity],
  (newEntity, changedEntity) => newEntity
    ? {
      ...newEntity,
      isValidId:
        utils.isValidId(newEntity.id) &&
        isUndefined(changedEntity[camelCase(newEntity.id)]),
      isVisible: true
    }
    : { isVisible: false, id: "", templates: [] }
)

export const selectRenamedEntity = createSelector(
  [getRenamedEntity, selectChangedEntity],
  (renamedEntity, changedEntity) => renamedEntity ?
    {
      ...renamedEntity,
      isValidId:
        utils.isValidId(renamedEntity.newId) &&
        (renamedEntity.oldId === camelCase(renamedEntity.newId) ||
        !changedEntity[camelCase(renamedEntity.newId)]),
      isVisible: true
    }
    : { isVisible: false, newId: "" }
)
export const selectNewEntityPath = createSelector(
  [selectNewEntity, getPath],
  (newEntity, path) => [...path, camelCase(newEntity.id)]
)

export const selectNewEntityValues = createSelector(
  [selectNewEntity, selectTemplates],
  (newEntity, templates) => utils.createEntry(newEntity, templates)
)

export const selectFieldLocalization = state => {
  if (!state.fieldLocalization) {
    return {
      languageIds: {},
      isVisible: false
    }
  }

  return { ...state.fieldLocalization,
    isVisible: true
  }
}

export const selectOriginalEntity = createSelector(
  [getOriginalContent, getPath],
  (originalContent, path) => path.length ? get(originalContent, path) : originalContent
)

export const selectTemplate = createSelector(
  [selectTemplates, selectChangedEntity],
  (templates, changedEntity) => utils.getTemplate(changedEntity[TEMPLATE_KEY], templates)
)

export const selectTemplateChildren = createSelector(
  [selectTemplate],
  template => template.children
)

export const selectTemplateFixedChildren = createSelector(
  [selectTemplate],
  template => template.fixedChildren
)

const selectFields = createSelector(
  [
    selectTemplate,
    selectOriginalEntity,
    selectChangedEntity,
    getPath,
    getLanguages,
    getProgress
  ],
  (template, originalEntity, changedEntity, path, languages, progress) => template.fields
    .filter(field => !field.condition || evaluate(field.condition, changedEntity))
    .map(field => {
      const originalValue = get(originalEntity, [field.id])
      const changedValue = changedEntity[field.id]
      const fieldPath = [...path, field.id]

      return { ...field,
        hasChanged: originalValue !== changedValue,
        isNew: isUndefined(originalValue),
        isLocalized: isLocalized(changedValue, languages),
        path: fieldPath,
        value: changedValue,
        progress: progress[fieldPath.toString()]
      }
    })
)

export const selectWhitelistedFields = createSelector(
  [selectFields, getWhitelist],
  (fields, whitelist) => fields.filter(field => isWhitelisted(whitelist, field.path))
)

const selectChildren = createSelector(
  [selectTemplate, selectOriginalEntity, selectChangedEntity, getPath],
  (template, originalEntity = {}, changedEntity, path) => {
    const allIds = Object.keys({ ...originalEntity, ...changedEntity })
    const fieldIds = template.fields.map(({ id }) => id)
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return allIds
      .filter(
        id => id !== TEMPLATE_KEY &&
        !fieldIds.includes(id) &&
        !fixedChildIds.includes(id))
      .sort()
      .map(id => ({
        hasChanged: originalEntity[id] !== changedEntity[id],
        isNew: isUndefined(originalEntity[id]),
        isDeleted: isUndefined(changedEntity[id]),
        id,
        path: [...path, id]
      }))
  }
)

export const selectWhitelistedChildren = createSelector(
  [selectChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)

const selectFixedChildren = createSelector(
  [selectTemplate, selectOriginalEntity, selectChangedEntity, getPath],
  (template, originalEntity = {}, changedEntity, path) => {
    const allIds = Object.keys({ ...originalEntity, ...changedEntity })
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return allIds
      .filter(id => fixedChildIds.includes(id))
      .sort()
      .map(id => ({
        hasChanged: originalEntity[id] !== changedEntity[id],
        isNew: isUndefined(originalEntity[id]),
        isDeleted: isUndefined(changedEntity[id]),
        id,
        path: [...path, id]
      }))
  }
)

export const selectWhitelistedFixedChildren = createSelector(
  [selectFixedChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)
