import { forwardRef } from "react"
import { Button } from "react-bootstrap"
import styled from "styled-components"

import { List } from "react-bootstrap-icons"

const StyledButton = styled(Button)`
  padding: 0px 5px;
`

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ToggleButton = forwardRef(({ children, onClick }, ref) => (
  <StyledButton
    variant="outline-secondary"
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  >
    {children}
    <List />
  </StyledButton>
))

ToggleButton.displayName = "ToggleButton"

export default ToggleButton
