import get from "lodash/get"

export function setValue(path, value) {
  return {
    type: "SET_VALUE",
    payload: {
      path,
      value,
    },
  }
}

export function undoChanges(path) {
  return (dispatch, getState) => {
    const originalValue = get(getState().originalContent, path)

    dispatch({
      type: "UNDO_CHANGES",
      payload: {
        path,
        originalValue,
      },
    })
  }
}

export function clearSrcTag(path) {
  return setValue(path, "")
}
