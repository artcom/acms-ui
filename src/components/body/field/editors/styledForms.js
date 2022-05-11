import styled, { css } from "styled-components"
import Form from "react-bootstrap/Form"

const formStyle = css`
  border: 0px;
  box-shadow: none;
  outline: none;
  width: 100%;
  padding: 10px 20px;
  ${(props) => props.direction && `direction: ${props.direction};`}

  :focus {
    border: 0px;
    box-shadow: none;
    outline: none;
  }
`

export const StyledFormControl = styled(Form.Control)`
  ${formStyle}
`

export const StyledFormSelect = styled(Form.Select)`
  ${formStyle}
`
