import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import { upperCase } from "lodash"

import { InfoLg } from "react-bootstrap-icons"

const FileRequirements = ({ field }) => {
  const hasRequirements = field.allowedMimeTypes ? true : false

  const hasInfos =
    field.value.path !== "" || field.value.lastModified !== "" || field.value.filename !== ""

  if (!hasRequirements && !hasInfos) {
    return null
  }
  const Tooltip = (
    <Popover>
      {field.allowedMimeTypes && (
        <>
          <Popover.Header>File Requirements</Popover.Header>
          <Popover.Body>
            <>
              Mime Types:{" "}
              {field.allowedMimeTypes.map((type, index) => {
                if (index === field.allowedMimeTypes.length - 1) {
                  return upperCase(type.split("/")[1])
                }
                return `${upperCase(type.split("/")[1])}, `
              })}
              <br />
            </>
          </Popover.Body>
        </>
      )}
      {hasInfos && (
        <>
          <Popover.Header>Image Infos</Popover.Header>
          <Popover.Body>
            {field.value.filename !== "" && (
              <>
                Name: {field.value.filename} <br />
              </>
            )}
            {field.value.lastModified !== "" && (
              <>
                Last modified: {field.value.lastModified} <br />
              </>
            )}
          </Popover.Body>
        </>
      )}
    </Popover>
  )

  return (
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={Tooltip}>
      <InfoLg size={25} opacity={0.6} />
    </OverlayTrigger>
  )
}

export default FileRequirements
