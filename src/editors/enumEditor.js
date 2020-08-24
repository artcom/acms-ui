import React from "react"
import Form from "react-bootstrap/Form"
import isString from "lodash/isString"
import startCase from "lodash/startCase"


export default function EnumEditor({ field, onChange }) {
  function onChangeEnum(event) {
    onChange({
      target: {
        value: event.target.value
      }
    })
  }

  const values = isString(field.values[0])
    ? field.values.map(id => ({ id, name: startCase(id) }))
    : field.values

  return (
    <Form.Control style={ { border: "0px", boxShadow: "none" } }
      as="select"
      value={ field.value }
      onChange={ onChangeEnum }>
      { values.map(({ id, name }, index) =>
        <option key={ index } value={ id }>{ name }</option>
      ) }
    </Form.Control>
  )
}
