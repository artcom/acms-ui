import get from "lodash/get"
import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function NumberEditor({ field, onChange }) {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const valid = field.value >= min && field.value <= max

  const [stringValue, setStringValue] = useState(field.value.toString())

  console.log("fieldValue", field.value)
  console.log("stringValue", stringValue)

  function onChangeFloat(event) {
    if (/^[-]?(\d*[.,]?)?\d*$/.test(event.target.value)) {
      let value

      if (event.target.value === "-") {
        value = -0
      } else if (event.target.value === "") {
        value = 0
      } else {
        value = parseFloat(event.target.value)
      }

      onChange({ target: { value } })

      setStringValue(event.target.value)
    }
  }

  function onBlurFloat(event) {
    if (event.target.value === "") {
      setStringValue("0")
    } else if (event.target.value === "-") {
      setStringValue("-0")
    }
  }

  return (
    <>
      <StyledFormControl
        isInvalid={ !valid }
        type="text"
        value={ stringValue }
        onChange={ onChangeFloat }
        onBlur={ onBlurFloat } />

      <Form.Control.Feedback type="invalid" tooltip>
        The number should be between { min } and { max }
      </Form.Control.Feedback>
    </>
  )
}
