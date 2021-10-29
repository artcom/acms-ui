import get from "lodash/get"
import React, { useState, useRef } from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function NumberEditor({ field, onChange }) {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const valid = field.value >= min && field.value <= max

  const inputRef = useRef(null)

  const [stringValue, setStringValue] = useState(field.value)

  function onChangeFloat(event) {
    console.log("fieldValue", field.value)
    console.log("stringValue", stringValue)
    console.log("eventValue", event.target.value)
    if (/^[-]?(\d*[.,]?)?\d*$/.test(event.target.value)) {
      setStringValue(event.target.value)

      onChange({
        target: {
          value: event.target.value === "-" ? -0 : parseFloat(event.target.value)
        }
      })
    }
  }

  function onBlurFloat() {
    if (inputRef.current.value === "") {
      inputRef.current.value = 0
    } else {
      parseFloat(inputRef.current.value)
    }
  }

  return (
    <>
      <StyledFormControl
        ref={ inputRef }
        isInvalid={ !valid }
        type="number"
        value={ stringValue }
        onChange={ onChangeFloat }
        onBlur={ onBlurFloat } />

      <Form.Control.Feedback type="invalid" tooltip>
        The number should be between { min } and { max }
      </Form.Control.Feedback>
    </>
  )
}
