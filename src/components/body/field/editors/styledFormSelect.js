import Form from "react-bootstrap/Form"
import styled from "styled-components"

export default styled(Form.Select)`
    border: 0px;
    box-shadow: none; 
    outline: none; 
    width: 100%;
    padding: 10px 20px;
    ${props => props.direction && `direction: ${props.direction};`}
    
    // this is a workaround style because the "custom" property
    // supported by bootstrap is not working with Styled Components
    appearance: none;
    background: #fff url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolyline stroke='%23000' stroke-width='2' fill='none' points='1,4 5,8 9,4'/%3E%3C/svg%3E") no-repeat right .75rem center/8px 20px;
    
    :focus {
        border: 0px;
        box-shadow: none; 
        outline: none; 
    }
`
