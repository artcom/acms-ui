import get from "lodash/get"

export function setValue(path, value) {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_VALUE",
      payload: {
        path,
        value,
        originalContent: getState().originalContent,
      },
    })
  }
}

export function undoChanges(path) {
  return (dispatch, getState) => setValue(path, get(getState().originalContent, path))
}

export function clearSrcTag(path) {
  return setValue(path, "")
}
