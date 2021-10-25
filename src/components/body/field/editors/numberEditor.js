import get from "lodash/get"
import React from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function NumberEditor({ field, onChange }) {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const valid = field.value >= min && field.value <= max

  function onChangeFloat(event) {
    onChange({
      target: {
        value: /^[-]?\d*[.,]?\d*$/.test(event.target.value) ? event.target.value : field.value
      }
    })
  }

  return (
    <>
      <StyledFormControl
        isInvalid={ !valid }
        type="text"
        value={ field.value }
        onChange={ onChangeFloat } />

      <Form.Control.Feedback type="invalid" tooltip>
        The number should be between { min } and { max }
      </Form.Control.Feedback>
    </>
  )
}
