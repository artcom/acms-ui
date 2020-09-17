import { createSelector } from "reselect"

import camelCase from "lodash/camelCase"
import get from "lodash/get"
import isBoolean from "lodash/isBoolean"
import isString from "lodash/isString"
import isUndefined from "lodash/isUndefined"
import mapValues from "lodash/mapValues"
import startCase from "lodash/startCase"
import { evaluate } from "./utils/condition"
import { isLocalized } from "./utils/language"
import { isAllowed } from "./utils/permission"
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

export const getAllowList = createSelector(
  [getUser, getUsers],
  (user, users) => {
    const userConfig = users.find(({ id }) => id === user)
    return userConfig && userConfig.allowList ? userConfig.allowList : ["**"]
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
      return fixedChild && fixedChild.name ? fixedChild.name : startCase(id)
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

export const selectAllowedFields = createSelector(
  [selectFields, getAllowList],
  (fields, allowList) => fields.filter(field => isAllowed(allowList, field.path))
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

export const selectAllowedChildren = createSelector(
  [selectChildren, getAllowList],
  (children, allowList) => children.filter(child => isAllowed(allowList, child.path))
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
        isEnabled: isEnabled(fixedChilds[id], changedEntity[id], languages[0].id),
        subtitle: subtitle(fixedChilds[id], changedEntity[id], languages[0].id),
        path: [...path, id]
      }))
  }
)

function isEnabled(child, content, defaultLanguage) {
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

export const selectAllowedFixedChildren = createSelector(
  [selectFixedChildren, getAllowList],
  (children, allowList) => children.filter(child => isAllowed(allowList, child.path))
)
