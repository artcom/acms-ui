import React from "react"
import FormCheck from "react-bootstrap/FormCheck"

export default function BooleanEditor({ field, onChange }) {
  function onChangeBoolean(event) {
    onChange({
      target: {
        value: event.target.checked
      }
    })
  }

  return (
    <FormCheck style={ { height: "2em", paddingTop: "5px", paddingLeft: "35px" } }>
      <FormCheck.Input
        type="checkbox"
        checked={ field.value }
        style={ { transform: "scale(1.3)" } }
        onChange={ onChangeBoolean } />
    </FormCheck>
  )
}
