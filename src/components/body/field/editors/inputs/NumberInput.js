import get from "lodash/get"
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap"
import StyledFormControl from "../styledFormControl"

const NumberInput = ({ field, onChange }) => {
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)

  const [stringValue, setStringValue] = useState(field.value.toString())

  useEffect(() => {
    setStringValue(field.value.toString())
  }, [field.value])

  const regex = /^-?((\d*([.,]\d*)?))?$/
  const valid = field.value >= min && field.value <= max &&
        !(field.integer && (stringValue.includes(",") || stringValue && stringValue.includes(".")))

  const onChangeString = event => {
    if (regex.test(event.target.value) || event.target.value === "") {
      setStringValue(event.target.value)
      let numberValue = parseFloat(event.target.value.replace(",", "."))
      if (event.target.value === "-" || event.target.value === "" || event.target.value === "-.") {
        numberValue = 0
      }

      onChange(numberValue)
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

export default NumberInput
