import { isMatch } from "picomatch"

export function isAllowed(path, { include, exclude }) {
  const pathString = path.join("/")
  return isMatch(pathString, include) && !isMatch(pathString, exclude)
}
