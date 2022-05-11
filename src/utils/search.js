export function isInSearch(searchValue, content) {
  if (searchValue === "") {
    return true
  }

  if (content.changedChildContent) {
    for (const [key, value] of Object.entries(content.changedChildContent)) {
      if (key !== "template") {
        if (isInSearch(searchValue, value)) {
          return true
        }
      }
    }
    return false
  } else if (content) {
    const contentValue = content.value ? content.value : content
    switch (typeof contentValue) {
      case "object":
        for (const [key, value] of Object.entries(contentValue)) {
          if (key !== "template") {
            if (isInSearch(searchValue, value)) {
              return true
            }
          }
        }
        return false
      case "number":
        if (
          contentValue
            .toString()
            .toLowerCase()
            .includes(searchValue.replace(",", ".").toLowerCase())
        ) {
          return true
        }
        break
      case "string":
        if (contentValue.match(/^\/?(\S+)-(\S+)\.(\w+)$/)) {
          const components = contentValue.match(/^\/?(\S+)-(\S+)\.(\w+)$/)
          if (
            components[1]
              .substring(components[1].lastIndexOf("/") + 1)
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          ) {
            return true
          }
        } else if (contentValue.toLowerCase().includes(searchValue.toLowerCase())) {
          return true
        }
        break
      case "boolean":
        if (contentValue.toString().toLowerCase().includes(searchValue.toLowerCase())) {
          return true
        }
        break
    }
  }
  return false
}
