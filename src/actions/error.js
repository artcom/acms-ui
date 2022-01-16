export function showError(title, details) {
  window.scrollTo(0, 0) // reset scroll position
  console.log("title in showError: ", title)

  const message = details.message

  return {
    type: "SHOW_ERROR",
    payload: {
      title,
      message
    }
  }
}

export function hideError() {
  return {
    type: "HIDE_ERROR"
  }
}
