export function showError(title, details) {
  window.scrollTo(0, 0) // reset scroll position

  return {
    type: "SHOW_ERROR",
    payload: {
      title,
      details
    }
  }
}

export function hideError() {
  return {
    type: "HIDE_ERROR"
  }
}
