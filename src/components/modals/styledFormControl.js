import styled from "styled-components"
import Form from "react-bootstrap/Form"

const StyledFormControl = styled(Form.Control)`
  box-shadow: none;

  :focus {
    box-shadow: none;
  }
`

export default StyledFormControl

