import React from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import RequirementIcon from "./requirementIcon"

const NumberRequirements = ({ field }) => {
  const hasRequirements = field.min || field.max || field.integer

  if (!hasRequirements) {
    return null
  }

  const Tooltip =
    <Popover>
      <Popover.Title> Number Requirements</Popover.Title>
      <Popover.Content>
        { field.integer && <> Integer <br /> </> }
        { field.min && <> Minimum: { field.min } <br /> </> }
        { field.max && <> Maximum: { field.max } <br /> </> }
      </Popover.Content>
    </Popover>

  return (
    <OverlayTrigger
      placement="bottom"
      delay={ { show: 250, hide: 400 } }
      overlay={ Tooltip }>
      <RequirementIcon />
    </OverlayTrigger>
  )
}

export default NumberRequirements
