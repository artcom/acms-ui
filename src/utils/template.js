import Joi from "joi"

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

const CAMEL_CASE_REGEXP = /^([a-z]+[0-9]*)([A-Z][a-z]*[0-9]*)*$/

const FIELD_SCHEMA = Joi.object({
  id: Joi.string().pattern(CAMEL_CASE_REGEXP).required(),
  name: Joi.string(),
  localization: Joi.array().unique().items(Joi.string()),
})

const ASSET_SCHEMA = FIELD_SCHEMA.append({
  allowedMimeTypes: Joi.array().items(Joi.string()),
})

const FIELDS_SCHEMA = Joi.array().items(
  FIELD_SCHEMA.append({
    type: Joi.string().required().valid("string"),
    maxLength: Joi.number(),
    multiline: Joi.bool(),
  }),
  FIELD_SCHEMA.append({
    type: Joi.string().required().valid("number"),
    min: Joi.number(),
    max: Joi.number(),
    integer: Joi.bool(),
  }),
  FIELD_SCHEMA.append({
    type: Joi.string().required().valid("geolocation"),
  }),
  FIELD_SCHEMA.append({
    type: Joi.string().required().valid("boolean"),
  }),
  FIELD_SCHEMA.append({
    type: Joi.string().required().valid("enum"),
    values: Joi.array().items(
      Joi.object({
        value: Joi.any().required(),
        name: Joi.string(),
      })
    ),
  }),
  ASSET_SCHEMA.append({
    type: Joi.string().required().valid("image"),
    width: Joi.number().min(1),
    height: Joi.number().min(1),
    minWidth: Joi.number().min(1),
    maxWidth: Joi.number().min(1),
    minHeight: Joi.number().min(1),
    maxHeight: Joi.number().min(1),
    aspectRatio: Joi.string(),
  }),
  ASSET_SCHEMA.append({
    type: Joi.string().required().valid("video"),
  }),
  ASSET_SCHEMA.append({
    type: Joi.string().required().valid("file"),
  })
)

const CHILDREN_SCHEMA = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    template: Joi.alternatives([
      Joi.string().required(),
      Joi.array().items(Joi.string().required()),
    ]),
  })
)

const TEMPLATE_SCHEMA = Joi.object({
  fields: FIELDS_SCHEMA,
  children: CHILDREN_SCHEMA,
}).pattern(/\w/, Joi.link(".."))

const TEMPLATES_SCHEMA = Joi.object().pattern(/\w/, TEMPLATE_SCHEMA)

export function validateTemplates(templates) {
  const { error } = TEMPLATES_SCHEMA.validate(templates, { abortEarly: false })

  if (error) {
    throw new Error(error)
  }
}
