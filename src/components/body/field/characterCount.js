import React from "react"

export default function CharacterCount({ value, maxLength }) {
  return <small className="text-muted"> { `${value.length}  /  ${maxLength}` } </small>
}
