export function getTemplate(id, templates) {
  return templates[id]
    ? templates[id]
    : templates[`${id}/index`]
}
