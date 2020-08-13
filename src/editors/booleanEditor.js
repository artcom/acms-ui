import React from "react"
import Form from "react-bootstrap/Form"

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
    <Form.Control
      style={ { border: "0px", boxShadow: "none" } }
      componentClass="select"
      value={ selected }
      onChange={ onChangeBoolean }>
      { values.map((value, index) => <option key={ index } value={ value }>{ value }</option>) }
    </Form.Control>
  )
}
