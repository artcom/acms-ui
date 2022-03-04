import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

export default function GeolocationEditor({ field, onChange }) {
  const [stringValue, setStringValue] = useState(field.value.toString())
  const min = field.path[field.path.length - 1] === "lon" ? -180.00 : -90.00
  const max = field.path[field.path.length - 1] === "lon" ? 180.00 : 90.00
  const regex = /^-?((\d+([.,]\d*)?))?$/
  const valid = field.value >= min && field.value <= max &&
    !(field.integer && (stringValue.includes(",") || stringValue && stringValue.includes(".")))

  const onChangeString = event => {
    if (regex.test(event.target.value) || event.target.value === "") {
      setStringValue(event.target.value)
      const finalString = fill(event.target.value.replace(",", "."))
      let floatGeolocation = parseFloat(finalString).toFixed(finalString.split(".")[1].length)
      if (event.target.value === "-" || event.target.value === "" || event.target.value === "-.") {
        floatGeolocation = 0
      }
      onChange({ target: { value: floatGeolocation } })
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
        { `This number should be between ${min} and ${max}` }
      </Form.Control.Feedback>
    </>
  )
}

function fill(value) {
  const split = value.split(".")
  if (split.length === 1) {return `${value}.000000`}
  if (split[1].length >= 6) {return value}

  let newValue = value
  for (let i = 0; i < 6 - split[1].length; i++) {
    newValue += "0"
  }

  return newValue
}
