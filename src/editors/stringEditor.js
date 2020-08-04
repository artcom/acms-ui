import React from "react"


export default function StringEditor({ field, onChange }) {
  return <textarea
    value={ field.value }
    onChange={ onChange } />
}
