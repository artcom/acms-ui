import Immutable from "immutable"
import mapValues from "lodash/mapValues"
import isUndefined from "lodash/isUndefined"
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
      name: "",
      templates: []
    }
  }

  return { ...state.newEntity,
    isValidName: validateEntityName(state.newEntity.name),
    isVisible: true
  }
}

export const getRenamedEntity = state => {
  if (!state.renamedEntity) {
    return {
      isVisible: false,
      newName: ""
    }
  }

  return { ...state.renamedEntity,
    isValidName: validateEntityName(state.renamedEntity.newName),
    isVisible: true
  }
}

function validateEntityName(name) {
  return name.length > 0
}

export const getNewEntityPath = createSelector(
  [getNewEntity, getFilePath],
  (newEntity, path) => [...path, camelCase(newEntity.name)]
)

export const getNewEntityValues = createSelector(
  [getNewEntity, getTemplates],
  (newEntity, templates) => {
    const template = utils.getTemplate(newEntity.template, templates)

    const values = new Immutable.Map(template.fields.map(field => [
      field.id,
      defaultValue(field)
    ]))

    return values
      .filter((value, id) => {
        const field = template.fields.find(item => item.id === id)
        return !field.condition || evaluate(field.condition, values)
      })
      .set("template", newEntity.template)
  }
)

function defaultValue(field) {
  if (!isUndefined(field.default)) {
    return field.default
  }

  switch (field.type) {
    case "enum":
      return field.values[0].value
    case "boolean":
      return false
    case "markdown":
    case "string":
      return ""

    default:
      return null
  }
}

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
    const childNames = new Immutable.Set(originalEntity.keySeq().concat(changedEntity.keySeq()))
    const fieldIds = template.fields.map(({ id }) => id)
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return childNames
      .filter(
        name => name !== TEMPLATE_KEY &&
        !fieldIds.includes(name) &&
        !fixedChildIds.includes(name))
      .sort()
      .map(child => ({
        hasChanged: !Immutable.is(originalEntity.get(child), changedEntity.get(child)),
        isNew: !originalEntity.has(child),
        isDeleted: !changedEntity.has(child),
        name: child,
        path: [...path, child]
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
    const childNames = new Immutable.Set(originalEntity.keySeq().concat(changedEntity.keySeq()))
    const fixedChildIds = template.fixedChildren.map(({ id }) => id)

    return childNames
      .filter(name => fixedChildIds.includes(name))
      .sort()
      .map(child => ({
        hasChanged: !Immutable.is(originalEntity.get(child), changedEntity.get(child)),
        isNew: !originalEntity.has(child),
        isDeleted: !changedEntity.has(child),
        name: child,
        path: [...path, child]
      }))
  }
)

export const getWhitelistedFixedChildren = createSelector(
  [getFixedChildren, getWhitelist],
  (children, whitelist) => children.filter(child => isWhitelisted(whitelist, child.path))
)
