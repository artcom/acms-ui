import React from "react"
import Form from "react-bootstrap/Form"
import styled from "styled-components"

const StyledFormControl = styled(Form.Control)`
    border: 0px;
    box-shadow: none; 
    outline: none; 
    width: 100%;
    padding: 10px 20px;

    :focus {
        border: 0px;
        box-shadow: none; 
        outline: none; 
    }
`

export default props =>
  <StyledFormControl { ...props } >
    { props.children }
  </StyledFormControl>

