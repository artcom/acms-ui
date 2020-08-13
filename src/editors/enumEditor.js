import React from "react"
import Form from "react-bootstrap/Form"


export default function EnumEditor({ field, onChange }) {
  function onChangeEnum(event) {
    onChange({
      target: {
        value: field.values[event.target.value].value
      }
    })
  }

  const selectedIndex = field.values.findIndex(value => value.value === field.value)

  return (
    <Form.Control style={ { border: "0px", boxShadow: "none" } }
      as="select"
      value={ selectedIndex }
      onChange={ onChangeEnum }>
      { field.values.map((value, index) =>
        <option key={ index } value={ index }>{ value.name }</option>
      ) }
    </Form.Control>
  )
}
