import get from "lodash/get"
import React from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function IntegerEditor({ field, onChange }) {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const valid = field.value >= min && field.value <= max

  function onChangeInteger(event) {
    onChange({
      target: {
        value: parseInt(event.target.value, 10)
      }
    })
  }

  return (
    <>
      <StyledFormControl
        isInvalid={ !valid }
        type="number"
        value={ field.value }
        onChange={ onChangeInteger } />

      <Form.Control.Feedback type="invalid" tooltip>
        The number should be between { min } and { max }
      </Form.Control.Feedback>
    </>
  )
}
