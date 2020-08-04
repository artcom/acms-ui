import React from "react"
import FormControl from "react-bootstrap/FormControl"

const values = ["true", "false"]

export default function BooleanEditor({ field, onChange }) {
  function onChangeBoolean(event) {
    onChange({
      target: {
        value: event.target.value === "true"
      }
    })
  }

  const selected = field.value ? "true" : "false"

  return (
    <FormControl componentClass="select" value={ selected } onChange={ onChangeBoolean }>
      { values.map((value, index) => <option key={ index } value={ value }>{ value }</option>) }
    </FormControl>
  )
}
