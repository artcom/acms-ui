import isUndefined from "lodash/isUndefined"

export function getTemplate(id, templates) {
  return templates[id]
    ? templates[id]
    : templates[`${id}/index`]
}

export function defaultValue(field) {
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
    case "number":
      return 0

    default:
      return null
  }
}
