import { createSelector } from "reselect"

import camelCase from "lodash/camelCase"
import get from "lodash/get"
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

export const selectDefaultLanguage = createSelector(
  [getLanguages],
  languages => languages[0]
)

export const selectAllowList = createSelector(
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

      return {
        ...field,
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
  [selectFields, selectAllowList],
  (fields, allowList) => fields.filter(field => isAllowed(allowList, field.path))
)

const selectChildren = createSelector(
  [
    selectTemplate,
    selectOriginalEntity,
    selectChangedEntity,
    getLanguages,
    selectTemplates,
    getPath
  ],
  (template, originalEntity = {}, changedEntity, languages, templates, path) => {
    const allIds = Object.keys({ ...originalEntity, ...changedEntity })
    const fieldIds = template.fields.map(({ id }) => id)
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return allIds
      .filter(
        id => id !== TEMPLATE_KEY &&
        !fieldIds.includes(id) &&
        !fixedChildIds.includes(id))
      .sort()
      .map(id => {
        const originalChildContent = originalEntity[id]
        const changedChildContent = changedEntity[id]
        const referenceContent = changedChildContent || originalChildContent
        const childTemplate = utils.getTemplate(referenceContent.template, templates)

        return {
          id,
          name: startCase(id),
          hasChanged: !utils.deepEqual(originalChildContent, changedChildContent),
          isNew: isUndefined(originalChildContent),
          isDeleted: isUndefined(changedChildContent),
          isEnabled: isEnabled(referenceContent, childTemplate, languages),
          subtitle: subtitle(referenceContent, childTemplate, languages),
          path: [...path, id]
        }
      })
  }
)

export const selectAllowedChildren = createSelector(
  [selectChildren, selectAllowList],
  (children, allowList) => children.filter(child => isAllowed(allowList, child.path))
)

const selectFixedChildren = createSelector(
  [
    selectTemplate,
    selectOriginalEntity,
    selectChangedEntity,
    getLanguages,
    selectTemplates,
    getPath
  ],
  (template, originalEntity = {}, changedEntity, languages, templates, path) =>
    template.fixedChildren
      .map(({ id, name }) => {
        const originalChildContent = originalEntity[id]
        const changedChildContent = changedEntity[id]
        const childTemplate = utils.getTemplate(changedChildContent.template, templates)

        return {
          id,
          name: name || startCase(id),
          hasChanged: !utils.deepEqual(originalChildContent, changedChildContent),
          isNew: isUndefined(originalChildContent),
          isEnabled: isEnabled(changedChildContent, childTemplate, languages),
          subtitle: subtitle(changedChildContent, childTemplate, languages),
          path: [...path, id]
        }
      })
)

function isEnabled(content, { enabledField, fields }, languages) {
  if (enabledField) {
    const field = fields.find(({ id }) => id === enabledField)
    if (field && field.type === "boolean") {
      const value = content[enabledField]
      return isLocalized(value, languages) ? value[languages[0].id] : value
    }
  }

  return true
}

function subtitle(content, { subtitleField, fields }, languages) {
  if (subtitleField) {
    const field = fields.find(({ id }) => id === subtitleField)
    if (field && field.type === "string") {
      const value = content[subtitleField]
      return isLocalized(value, languages) ? value[languages[0].id] : value
    }
  }

  return null
}

export const selectAllowedFixedChildren = createSelector(
  [selectFixedChildren, selectAllowList],
  (children, allowList) => children.filter(child => isAllowed(allowList, child.path))
)
