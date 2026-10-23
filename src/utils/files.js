import pickBy from "lodash/pickBy"
import * as utils from "./index"

/*
  Converts the content tree into the file map expected by the ACMS API (keys are paths relative to
  the content path without extension).

  The files the tree was loaded from (`contentFiles`) are used to write everything back in its
  original structure:
  - an entity is written to `<path>` if it was stored as `<path>.json`, otherwise to `<path>/index`
  - entries without a template are not managed by the ACMS UI. Their original files are copied
    unchanged, or they stay inside the index file of their parent if they were stored there.
*/
export function toFiles(content, templates, contentFiles = {}) {
  return entityToFiles(content, templates, contentFiles, [])
}

function entityToFiles({ template, ...content }, templates, contentFiles, path) {
  const { fields = [] } = utils.getTemplate(template, templates)
  const fieldIds = fields.map(({ id }) => id)

  const index = fieldIds.reduce((result, id) => ({ ...result, [id]: content[id] }), { template })
  const childFiles = {}

  Object.keys(content)
    .filter((id) => !fieldIds.includes(id))
    .forEach((id) => {
      const child = content[id]
      const childPath = [...path, id]

      if (utils.isUntemplatedEntry(child)) {
        const originalFiles = filesOf(contentFiles, childPath)
        if (Object.keys(originalFiles).length > 0) {
          Object.assign(childFiles, originalFiles)
        } else {
          index[id] = child
        }
      } else {
        Object.assign(childFiles, entityToFiles(child, templates, contentFiles, childPath))
      }
    })

  return { [fileKey(contentFiles, path)]: index, ...childFiles }
}

function fileKey(contentFiles, path) {
  const key = path.join("/")
  const indexKey = path.length === 0 ? "index" : `${key}/index`

  // both forms can exist, they were merged on load and are written as index file
  return path.length > 0 && hasFile(contentFiles, key) && !hasFile(contentFiles, indexKey)
    ? key
    : indexKey
}

function filesOf(contentFiles, path) {
  const key = path.join("/")
  return pickBy(
    contentFiles,
    (file, filePath) => filePath === key || filePath.startsWith(`${key}/`),
  )
}

function hasFile(contentFiles, key) {
  return Object.prototype.hasOwnProperty.call(contentFiles, key)
}
