import React from "react"
import { FormControl } from "react-bootstrap"

export default function StringEditor({ field, onChange }) {
  return <FormControl
    componentClass="textarea"
    value={ field.value }
    onChange={ onChange } />
}
