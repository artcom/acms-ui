import isPlainObject from "lodash/isPlainObject"

export function isLocalized(value, languages) {
  return isPlainObject(value) && Object.keys(value).every(key => isLanguage(key, languages))
}

function isLanguage(id, languages) {
  return languages.findIndex(language => language.id === id) >= 0
}

export function getDefaultLanguage(languages) {
  const language = languages[0] || {}
  return { id: "default", name: "default", textDirection: "ltr", ...language }
}

export function getLanguage(id, languages) {
  const language = languages.find(lang => lang.id === id) || {}
  return { id, name: id, textDirection: "ltr", ...language }
}
