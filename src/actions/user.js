export function updateUser() {
  const queryString = window.location.search.substring(1)
  const { user = null } = queryParams(queryString)

  return {
    type: "UPDATE_USER",
    payload: {
      user
    }
  }
}

function queryParams(queryString) {
  return queryString.split("&").reduce((params, pair) => {
    const [key, value] = pair.split("=")
    return { ...params, [decodeURIComponent(key)]: decodeURIComponent(value) }
  }, {})
}
