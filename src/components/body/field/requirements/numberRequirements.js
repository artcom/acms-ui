import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"

import { useState } from "react"

import { InfoLg } from "react-bootstrap-icons"

const NumberRequirements = ({ field }) => {
  const [showPopover, setShowPopover] = useState(false)

  const handleOnMouseEnter = () => {
    setShowPopover(true)
  }
  const handleOnMouseLeave = () => {
    setShowPopover(false)
  }

  const hasRequirements = field.min || field.max || field.integer

  if (!hasRequirements) {
    return null
  }

  const Tooltip = (
    <Popover onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
      <Popover.Header>Requirements</Popover.Header>
      <Popover.Body>
        {field.integer && (
          <>
            {" "}
            Integer <br />{" "}
          </>
        )}
        {field.min && (
          <>
            {" "}
            Minimum: {field.min} <br />{" "}
          </>
        )}
        {field.max && (
          <>
            {" "}
            Maximum: {field.max} <br />{" "}
          </>
        )}
      </Popover.Body>
    </Popover>
  )

  return (
    <OverlayTrigger
      show={showPopover}
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={Tooltip}
    >
      <InfoLg
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        size={25}
        opacity={0.6}
      />
    </OverlayTrigger>
  )
}

export default NumberRequirements
