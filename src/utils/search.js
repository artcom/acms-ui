export function isInSearch(searchValue, content) {
  if (searchValue === "") {
    return true
  }

  if (!content) {
    return false
  }

  switch (typeof content) {
    case "object":
      return Object.entries(content).some(
        ([key, value]) => key !== "template" && isInSearch(searchValue, value),
      )
    case "number":
      return content.toString().includes(searchValue.replace(",", "."))
    case "string":
      return content.toLowerCase().includes(searchValue)
    default:
      return false
  }
}
