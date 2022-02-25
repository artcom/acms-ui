import get from "lodash/get"
import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function NumberEditor({ field, onChange }) {
  const [stringValue, setStringValue] = useState(field.value.toString())
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const regex = /^-?((\d+([.,]\d*)?))?$/
  const valid = field.value >= min && field.value <= max &&
    !(field.integer && (stringValue.includes(",") || stringValue && stringValue.includes(".")))

  const onChangeString = event => {
    if (regex.test(event.target.value) || event.target.value === "") {
      setStringValue(event.target.value)
      let floatNumber = parseFloat(event.target.value.replace(",", "."))
      if (event.target.value === "-" || event.target.value === "" || event.target.value === "-.") {
        floatNumber = 0
      }
      onChange({ target: { value: floatNumber } })
    }
  }

  const onBlurString = () => {
    setStringValue(field.value.toString())
  }

  return (
    <>
      <StyledFormControl
        isInvalid={ !valid }
        type="text"
        value={ stringValue }
        onChange={ onChangeString }
        onBlur={ onBlurString } />
      <Form.Control.Feedback type="invalid" tooltip>
        { `This ${field.integer ? "integer" : "number"} should be between ${min} and ${max}` }
      </Form.Control.Feedback>
    </>
  )
}
