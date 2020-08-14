import React from "react"
import { Button } from "react-bootstrap"

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export default React.forwardRef(({ children, onClick }, ref) =>
  <Button
    variant="outline-secondary"
    style={ { padding: "0px 5px" } }
    ref={ ref }
    onClick={ e => {
      e.preventDefault()
      onClick(e)
    } }>
    { children }
    &#9776;
  </Button>
)
