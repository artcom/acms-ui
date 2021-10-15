import Form from "react-bootstrap/Form"
import styled from "styled-components"

export default styled(Form.Control)`
    border: 0px;
    box-shadow: none; 
    outline: none; 
    width: 100%;
    padding: 10px 20px;
    ${props => props.direction && `direction: ${props.direction};`}

    :focus {
        border: 0px;
        box-shadow: none; 
        outline: none; 
    }
`
