import fromPairs from "lodash/fromPairs"
import isUndefined from "lodash/isUndefined"
import { selectFieldLocalization, getLanguages } from "../selectors"

export function startFieldLocalization(field) {
  return (dispatch, getState) => {
    const state = getState()
    const languages = getLanguages(state)

    dispatch({
      type: "START_FIELD_LOCALIZATION",
      payload: {
        field,
        languageIds: fromPairs(languages.map((language, i) =>
          [language.id, i === 0 || field.isLocalized && !isUndefined(field.value[language.id])]
        ))
      }
    })
  }
}

export function updateFieldLocalization(languageId, hasLocalization) {
  return {
    type: "UPDATE_FIELD_LOCALIZATION",
    payload: {
      languageId,
      hasLocalization
    }
  }
}

export function finishFieldLocalization() {
  return (dispatch, getState) => {
    const state = getState()
    const fieldLocalization = selectFieldLocalization(state)
    const languages = getLanguages(state)
    const defaultLanguageId = languages[0].id

    dispatch({
      type: "FINISH_FIELD_LOCALIZATION",
      payload: {
        defaultLanguageId,
        fieldLocalization
      }
    })
  }
}

export function cancelFieldLocalization() {
  return {
    type: "CANCEL_FIELD_LOCALIZATION"
  }
}
