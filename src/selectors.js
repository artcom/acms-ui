import { createSelector } from "reselect"

import camelCase from "lodash/camelCase"
import get from "lodash/get"
import isUndefined from "lodash/isUndefined"
import mapValues from "lodash/mapValues"
import startCase from "lodash/startCase"
import { evaluate } from "./utils/condition"
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
export const getLogoImageUri = state => state.config.logoImageUri
export const getTextDirection = state => state.config.textDirection
export const getProgress = state => state.progress
export const getUser = state => state.user
export const getUsers = state => state.config.users
export const getPath = state => state.path
export const getNewEntity = state => state.newEntity
export const getRenamedEntity = state => state.renamedEntity
export const getTemplates = state => state.templates

export const selectPermissions = createSelector(
  [getUser, getUsers],
  (user, users) => {
    const userConfig = users.find(({ id }) => id === user)
    return userConfig ? userConfig.permissions : users[0].permissions
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


function getChangedEntity(changedContent, path) {
  const entity = path.length ? get(changedContent, path) : changedContent
  return entity
}

export const selectChangedEntity = createSelector(
  [getChangedContent, getPath],
  (changedContent, path) => getChangedEntity(changedContent, path)
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

export const selectOriginalEntity = createSelector(
  [getOriginalContent, getPath],
  (originalContent, path) => path.length ? get(originalContent, path) : originalContent
)

export const selectTemplateId = createSelector(
  [selectChangedEntity],
  changedEntity => changedEntity[TEMPLATE_KEY]
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
    getProgress
  ],
  (template, originalEntity, changedEntity, path, progress) => template.fields
    .filter(field => !field.condition || evaluate(field.condition, changedEntity))
    .map(field => {
      const originalValue = get(originalEntity, [field.id])
      const changedValue = changedEntity[field.id]
      const fieldPath = [...path, field.id]

      return {
        ...field,
        hasChanged: !utils.deepEqual(originalValue, changedValue),
        isNew: isUndefined(originalValue),
        path: fieldPath,
        value: changedValue,
        progress: progress[fieldPath.toString()]
      }
    })
)

export const selectAllowedFields = createSelector(
  [selectFields, selectPermissions],
  (fields, permissions) => fields.filter(field => isAllowed(field.path, permissions))
)

const selectChildren = createSelector(
  [
    selectTemplate,
    selectOriginalEntity,
    selectChangedEntity,
    selectTemplates,
    getPath
  ],
  (template, originalEntity = {}, changedEntity, templates, path) => {
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
          isEnabled: isEnabled(referenceContent, childTemplate),
          subtitle: subtitle(referenceContent, childTemplate),
          path: [...path, id]
        }
      })
  }
)

export const selectAllowedChildren = createSelector(
  [selectChildren, selectPermissions],
  (children, permissions) => children.filter(child => isAllowed(child.path, permissions))
)

const selectFixedChildren = createSelector(
  [
    selectTemplate,
    selectOriginalEntity,
    selectChangedEntity,
    selectTemplates,
    getPath
  ],
  (template, originalEntity = {}, changedEntity, templates, path) =>
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
          isEnabled: isEnabled(changedChildContent, childTemplate),
          subtitle: subtitle(changedChildContent, childTemplate),
          path: [...path, id]
        }
      })
)

function isEnabled(content, { enabledField, fields }) {
  if (enabledField) {
    const field = fields.find(({ id }) => id === enabledField)
    if (field && field.type === "boolean") {
      if (field.localization) {
        return field.localization.length > 0 ? content[enabledField][field.localization[0]] : false
      } else {
        return content[enabledField]
      }
    }
  }

  return true
}

function subtitle(content, { subtitleField, fields }) {
  if (subtitleField) {
    const field = fields.find(({ id }) => id === subtitleField)
    if (field && field.type === "string") {
      if (field.localization) {
        return field.localization.length > 0 ? content[subtitleField][field.localization[0]] : ""
      } else {
        return content[subtitleField]
      }
    }
  }

  return null
}

export const selectAllowedFixedChildren = createSelector(
  [selectFixedChildren, selectPermissions],
  (children, permissions) => children.filter(child => isAllowed(child.path, permissions))
)

export const getNeighbourSiblings = createSelector(
  [
    getPath,
    getChangedContent,
    selectTemplates,
    selectTemplate,
  ],
  (path, changedContent, templates) => {
    if (path.length === 0) {
      return [null, null]
    }

    const parentPath = path.slice(0, path.length - 1)
    const parentEntity = getChangedEntity(changedContent, parentPath)
    const parentTemplate = utils.getTemplate(parentEntity.template, templates)

    const fieldIds = parentTemplate.fields.map(({ id }) => id)
    const fixedChildIds = parentTemplate.fixedChildren.map(({ id }) => id)

    const siblingsIds = [...fixedChildIds]

    Object.keys(parentEntity).sort().forEach(id => {
      if (id !== TEMPLATE_KEY &&
        !fieldIds.includes(id) &&
        !fixedChildIds.includes(id)) {
        siblingsIds.push(id)
      }
    })

    const ownId = path[path.length - 1]
    const ownIndex = siblingsIds.indexOf(ownId)

    return [
      getSibling(siblingsIds[ownIndex - 1], parentPath, parentTemplate.fixedChildren),
      getSibling(siblingsIds[ownIndex + 1], parentPath, parentTemplate.fixedChildren)
    ]
  }
)

function getSibling(id, parentPath, fixedChildren) {
  if (!id) {
    return null
  }

  const fixedChild = fixedChildren.find(child => id === child.id)
  return {
    path: [...parentPath, id],
    name: fixedChild && fixedChild.name ? fixedChild.name : startCase(id)
  }
}
