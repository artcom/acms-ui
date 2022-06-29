import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import { upperCase } from "lodash"

import { InfoLg } from "react-bootstrap-icons"

const FileRequirements = ({ field }) => {
  const hasRequirements = field.allowedMimeTypes ? true : false

  if (!hasRequirements) {
    return null
  }
  const Tooltip = (
    <Popover>
      <Popover.Header>File Requirements</Popover.Header>
      <Popover.Body>
        {field.allowedMimeTypes && (
          <>
            Mime Types:
            {field.allowedMimeTypes.map((type, index) => {
              if (index === field.allowedMimeTypes.length - 1) {
                return upperCase(type.split("/")[1])
              }
              return `${upperCase(type.split("/")[1])}, `
            })}
            <br />
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

export default FileRequirements
