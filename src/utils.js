import { isString, isNumber, isUndefined } from "lodash"

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

export function isValid(value, field) {
  switch (field.type) {
    case "enum":
      return field.values.map(val => val.value).includes(value)
    case "boolean":
      return value === true || value === false
    case "audio":
    case "image":
    case "file":
    case "video":
    case "markdown":
    case "string":
      return isString(value)
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
