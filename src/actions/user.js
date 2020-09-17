export function updateUser() {
  const urlParams = new URLSearchParams(window.location.search)
  const user = urlParams.get("user")

  return {
    type: "UPDATE_USER",
    payload: {
      user
    }
  }
}
