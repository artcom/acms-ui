import { isPlainObject } from "lodash"

export function isLocalized(value, languages) {
  return isPlainObject(value) && Object.keys(value).every(key => isLanguage(key, languages))
}

function isLanguage(id, languages) {
  return languages.findIndex(language => language.id === id) >= 0
}

export function getLanguageName(id, languages) {
  const language = languages.find(language => language.id === id)
  return language ? language.name : `Unknown Language (${id})`
}
