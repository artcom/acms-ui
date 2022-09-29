const DEFAULT_TEMPLATE = { fields: [], fixedChildren: [], children: [] }

export function getTemplate(id, templates) {
  if (templates[id]) {
    return { ...DEFAULT_TEMPLATE, ...templates[id] }
  }

  if (templates[`${id}/index`]) {
    return { ...DEFAULT_TEMPLATE, ...templates[`${id}/index`] }
  }

  return DEFAULT_TEMPLATE
}

export function validateTemplates(templates) {}
