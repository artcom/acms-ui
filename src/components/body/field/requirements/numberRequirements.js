import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"

import { InfoLg } from "react-bootstrap-icons"

const NumberRequirements = ({ field }) => {
  const hasRequirements = field.min || field.max || field.integer

  if (!hasRequirements) {
    return null
  }

  const Tooltip = (
    <Popover>
      <Popover.Header> Number Requirements</Popover.Header>
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
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={Tooltip}>
      <InfoLg size={25} opacity={0.6} />
    </OverlayTrigger>
  )
}

export default NumberRequirements
