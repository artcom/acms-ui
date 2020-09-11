import { createSelector } from "reselect"

import camelCase from "lodash/camelCase"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import isString from "lodash/isString"
import mapValues from "lodash/mapValues"
import isUndefined from "lodash/isUndefined"
import { evaluate } from "./condition"
import { isLocalized } from "./language"
import { isWhitelisted } from "./whitelist"
import * as utils from "./utils"

const TEMPLATE_KEY = "template"

export const getVersion = state => state.version
export const getOriginalContent = state => state.originalContent
export const getChangedContent = state => state.changedContent
export const getLanguages = state => state.config.languages
export const getContentPath = state => state.config.contentPath
export const getChildrenLabel = state => state.config.childrenLabel
export const getFieldsLabel = state => state.config.fieldsLabel
export const getProgress = state => state.progress
export const getUser = state => state.user
export const getUsers = state => state.config.users
export const getPath = state => state.path
export const getNewEntity = state => state.newEntity
export const getRenamedEntity = state => state.renamedEntity
export const getTemplates = state => state.templates

export const getWhitelist = createSelector(
  [getUser, getUsers],
  (user, users) => {
    const userConfig = users.find(({ id }) => id === user)
    return userConfig && userConfig.whitelist ? userConfig.whitelist : ["**"]
  }
)

export const selectTemplates = createSelector(
  [getTemplates],
  templates => mapValues(templates, template => ({
    fields: [],
    children: [],
    fixedChildren: [],
    ...template
  }))
)

export const getPathNames = createSelector(
  [getPath, getChangedContent, selectTemplates],
  (path, changedContent, templates) =>
    path.map((id, index) => {
      const currentPath = path.slice(0, index)
      const currentEntry = utils.getFromPath(changedContent, currentPath)
      const template = utils.getTemplate(currentEntry.template, templates)
      const fixedChild = template.fixedChildren.find(child => child.id === id)
      return fixedChild && fixedChild.name ? fixedChild.name : id
    })
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
        isUndefined(changedEntity[camelCase(renamedEntity.newId)])),
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
        hasChanged: !utils.deepEqual(originalValue, changedValue),
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
        hasChanged: !utils.deepEqual(originalEntity[id], changedEntity[id]),
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
  [selectTemplate, selectOriginalEntity, selectChangedEntity, getLanguages, getPath],
  (template, originalEntity = {}, changedEntity, languages, path) => {
    const allIds = Object.keys({ ...originalEntity, ...changedEntity })
    const fixedChilds = template.fixedChildren
      .reduce((result, child) => ({ ...result, [child.id]: child }), {})

    return allIds
      .filter(id => fixedChilds[id])
      .sort()
      .map(id => ({ ...fixedChilds[id],
        hasChanged: !utils.deepEqual(originalEntity[id], changedEntity[id]),
        isNew: isUndefined(originalEntity[id]),
        isDeleted: isUndefined(changedEntity[id]),
        isActive: isActive(fixedChilds[id], changedEntity[id], languages[0].id),
        subtitle: subtitle(fixedChilds[id], changedEntity[id], languages[0].id),
        path: [...path, id]
      }))
  }
)

function isActive(child, content, defaultLanguage) {
  if (child.enabledField) {
    return isBoolean(content[child.enabledField])
      ? content[child.enabledField]
      : content[child.enabledField][defaultLanguage]
  } else {
    return true
  }
}

function subtitle(child, content, defaultLanguage) {
  if (child.subtitleField) {
    return isString(content[child.subtitleField])
      ? content[child.subtitleField]
      : content[child.subtitleField][defaultLanguage]
  } else {
    return null
  }
}

export const selectWhitelistedFixedChildren = createSelector(
  [selectFixedChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)
