import React from "react"
import FormCheck from "react-bootstrap/FormCheck"
import styled from "styled-components"

const StyledFormCheck = styled(FormCheck)`
  height: 2em;
  padding-top: 5px;
  margin-left: 20px;
`

const StyledFormCheckInput = styled(FormCheck.Input)`
  transform: scale(1.3);
`

export default function BooleanEditor({ field, onChange }) {
  return (
    <StyledFormCheck>
      <StyledFormCheckInput
        type="checkbox"
        checked={ field.value }
        onChange={ event => onChange(event.target.checked) } />
    </StyledFormCheck>
  )
}
