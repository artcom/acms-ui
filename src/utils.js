import isUndefined from "lodash/isUndefined"

export function getTemplate(id, templates) {
  return templates[id]
    ? templates[id]
    : templates[`${id}/index`]
}

export function createEntry(entry, templates) {
  return entry.type ? createValue(entry) : createChild(entry, templates)
}

function createChild({ template }, templates) {
  const { fields = [], fixedChildren = [] } = getTemplate(template, templates)

  const child = { template };
  [...fields, ...fixedChildren].forEach(entry => {
    child[entry.id] = createEntry(entry, templates)
  })

  return child
}

export function createValue(field) {
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
