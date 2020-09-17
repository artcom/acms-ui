import React from "react"
import FormCheck from "react-bootstrap/FormCheck"
import styled from "styled-components"

const StyledFormCheck = styled(FormCheck)`
  height: 2em;
  padding-top: 5px;
  padding-left: 35px;
`

const StyledFormCheckInput = styled(FormCheck.Input)`
  transform: scale(1.3);
`

export default function BooleanEditor({ field, onChange }) {
  function onChangeBoolean(event) {
    onChange({
      target: {
        value: event.target.checked
      }
    })
  }

  return (
    <StyledFormCheck>
      <StyledFormCheckInput
        type="checkbox"
        checked={ field.value }
        onChange={ onChangeBoolean } />
    </StyledFormCheck>
  )
}
