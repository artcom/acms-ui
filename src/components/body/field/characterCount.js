import React from "react"

export default function CharacterCount({ value, maxLength }) {
  return <small className="text-muted"> { `${maxLength - value.length}  /  ${maxLength}` } </small>
}
