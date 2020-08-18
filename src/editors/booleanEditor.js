import React from "react"
import Form from "react-bootstrap/Form"

const values = ["true", "false"]

export default function BooleanEditor({ field, onChange }) {
  function onChangeBoolean(event) {
    onChange({
      target: {
        value: event.target.value === "0"
      }
    })
  }

  const selectedIndex = field.value ? 0 : 1

  return (
    <Form.Control style={ { border: "0px", boxShadow: "none" } }
      as="select"
      value={ selectedIndex }
      onChange={ onChangeBoolean }>
      { values.map((value, index) =>
        <option key={ index } value={ index }>{ value }</option>
      ) }
    </Form.Control>
  )
}
