import get from "lodash/get"
import isString from "lodash/isString"
import isNumber from "lodash/isNumber"
import isUndefined from "lodash/isUndefined"
import isPlainObject from "lodash/isPlainObject"

const DEFAULT_TEMPLATE = { fields: [], fixedChildren: [], children: [] }

export function getFromPath(object, path, defaultValue) {
  return path.length === 0 ? object : get(object, path, defaultValue)
}

export function getTemplate(id, templates) {
  if (templates[id]) {
    return { ...DEFAULT_TEMPLATE, ...templates[id] }
  }

  if (templates[`${id}/index`]) {
    return { ...DEFAULT_TEMPLATE, ...templates[`${id}/index`] }
  }

  return DEFAULT_TEMPLATE
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
    case "integer":
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
      return isString(value)
    case "number":
      return isNumber(value)
    case "integer":
      return isNumber(value)
    default:
      return true
  }
}

export function isValidId(id) {
  return isString(id)
    && id.length > 0
    && id === id.replace(/([^a-z0-9\s])/gi, "_")
}

// only supports primitives, arrays and objects
export function deepEqual(a, b) {
  if (a === b) {
    return true
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return Object.keys(a).length === Object.keys(b).length &&
      !Object.keys(a).some(key => !deepEqual(a[key], b[key]))
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && !a.some((value, index) => !deepEqual(value, b[index]))
  }

  return false
}
