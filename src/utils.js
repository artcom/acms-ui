import get from "lodash/get"
import isString from "lodash/isString"
import isNumber from "lodash/isNumber"
import isUndefined from "lodash/isUndefined"

export function getFromPath(object, path, defaultValue) {
  return path.length === 0 ? object : get(object, path, defaultValue)
}

export function getTemplate(id, templates) {
  return templates[id]
    ? templates[id]
    : templates[`${id}/index`]
}

export function createEntry(entry, templates) {
  return entry.type ? createFieldValue(entry) : createChildValue(entry.template, templates)
}

export function createChildValue(template, templates) {
  const { fields = [], fixedChildren = [] } = getTemplate(template, templates)

  const child = { template };
  [...fields, ...fixedChildren].forEach(entry => {
    child[entry.id] = createEntry(entry, templates)
  })

  return child
}

export function createFieldValue(field) {
  if (!isUndefined(field.default)) {
    return field.default
  }

  switch (field.type) {
    case "enum":
      return isString(field.values[0]) ? field.values[0] : field.values[0].id
    case "boolean":
      return false
    case "audio":
    case "image":
    case "file":
    case "video":
    case "markdown":
    case "string":
      return ""
    case "number":
    {
      const min = isNumber(field.min) ? field.min : -Infinity
      const max = isNumber(field.max) ? field.max : Infinity
      return Math.max(min, Math.min(0, max))
    }

    default:
      return null
  }
}

export function isValidField(value, field) {
  switch (field.type) {
    case "enum":
      return isString(field.values[0])
        ? field.values.includes(value)
        : field.values.map(val => val.id).includes(value)
    case "boolean":
      return value === true || value === false
    case "audio":
    case "image":
    case "file":
    case "video":
      return isString(value)
    case "markdown":
    case "string":
      return isString(value) && value.length <= get(field, "maxLength", Infinity)
    case "number":
    {
      if (!isNumber(value)) {
        return false
      }
      if (isNumber(field.min) && value < field.min) {
        return false
      }
      if (isNumber(field.max) && value > field.max) {
        return false
      }
      return true
    }
    default:
      return true
  }
}

export function isValidId(id) {
  return isString(id)
    && id.length > 0
    && id === id.replace(/([^a-z0-9\s])/gi, "_")
}
