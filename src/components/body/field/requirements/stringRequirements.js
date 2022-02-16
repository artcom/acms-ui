import React from "react"

const StringRequirements = ({ field }) => {
  if (field && field.maxLength && !field.localization) {
    return <small className="text-muted"> { `${field.maxLength - field.value.length}  /  ${field.maxLength}` } </small>
  } else {
    return null
  }
}

export default StringRequirements

