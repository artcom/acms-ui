import { get, isEqual, isString, isNumber, isUndefined, isPlainObject } from "lodash"

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
  return entry.type ? createField(entry) : createChildValue(entry.template, templates)
}

export function createChildValue(template, templates) {
  const { fields = [], fixedChildren = [] } = getTemplate(template, templates)

  const child = { template }
  ;[...fields, ...fixedChildren].forEach((entry) => {
    child[entry.id] = createEntry(entry, templates)
  })

  return child
}

export function createField(field) {
  if (field.localization) {
    return field.localization.reduce((localizedField, id) => {
      localizedField[id] = createFieldValue(field) // eslint-disable-line no-param-reassign
      return localizedField
    }, {})
  } else {
    return createFieldValue(field)
  }
}

export function createFieldValue(field) {
  if (!isUndefined(field.default)) {
    return field.default
  }

  switch (field.type) {
    case "enum":
      return field.values[0].value
    case "boolean":
      return false
    case "audio":
    case "image":
    case "file":
    case "video":
    case "markdown":
    case "string":
      return ""
    case "number": {
      const min = isNumber(field.min) ? field.min : -Infinity
      const max = isNumber(field.max) ? field.max : Infinity
      return Math.max(min, Math.min(0, max))
    }
    case "geolocation":
      return { lat: 0, long: 0 }
    default:
      return null
  }
}

export function isValidField(value, field) {
  switch (field.type) {
    case "enum":
      return field.values.some((val) => isEqual(val.value, value))
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
    case "geolocation":
      return (
        isPlainObject(value) &&
        Object.keys(value).length === 2 &&
        isNumber(value.lat) &&
        isNumber(value.long)
      )
    default:
      return true
  }
}

export function isValidId(id) {
  return isString(id) && id.length > 0 && id === id.replace(/([^a-z0-9\s])/gi, "_")
}

// only supports primitives, arrays and objects
export function deepEqual(a, b) {
  if (a === b) {
    return true
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      !Object.keys(a).some((key) => !deepEqual(a[key], b[key]))
    )
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && !a.some((value, index) => !deepEqual(value, b[index]))
  }

  return false
}
