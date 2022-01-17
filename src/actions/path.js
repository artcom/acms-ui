import { toPath } from "../utils/hash"

export function updatePath(hash) {
  window.scrollTo(0, 0) // reset scroll position

  return {
    type: "UPDATE_PATH",
    payload: {
      path: toPath(hash)
    }
  }
}

export function configPath(path) {
  return {
    type: "CONFIG_PATH",
    payload: {
      path
    }
  }
}
