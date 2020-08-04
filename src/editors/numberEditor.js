import get from "lodash/get"
import isNumber from "lodash/isNumber"
import React from "react"
import FormControl from "react-bootstrap/FormControl"
import FormGroup from "react-bootstrap/FormGroup"

export default function NumberEditor({ field, onChange }) {
  const value = field.value
  const min = get(field, "min", -Infinity)
  const max = get(field, "max", Infinity)
  const isValid = isNumber(value) && value >= min && value <= max

  function onChangeFloat(event) {
    onChange({
      target: {
        value: parseFloat(event.target.value)
      }
    })
  }

  return (
    <FormGroup validationState={ isValid ? null : "warning" }>
      <FormControl type="number" value={ value } onChange={ onChangeFloat } />
      { isValid || <div>The number should be between { min } and { max }.</div> }
    </FormGroup>
  )
}
