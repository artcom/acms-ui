import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import { upperCase } from "lodash"

import { InfoLg } from "react-bootstrap-icons"

const ImageRequirements = ({ field }) => {
  const hasRequirements =
    field.heigth ||
    field.minHeight ||
    field.maxHeight ||
    field.width ||
    field.minWidth ||
    field.maxWidth ||
    field.aspectRatio ||
    field.allowedMimeTypes

  if (!hasRequirements) {
    return null
  }
  const Tooltip = (
    <Popover>
      <Popover.Header>Image Requirements</Popover.Header>
      <Popover.Body>
        {field.height && (
          <>
            {" "}
            Height: {field.height} <br />{" "}
          </>
        )}
        {field.minHeight && (
          <>
            {" "}
            Min. Height: {field.minHeight} <br />{" "}
          </>
        )}
        {field.maxHeight && (
          <>
            {" "}
            Max. Height: {field.maxHeight} <br />{" "}
          </>
        )}
        {field.width && (
          <>
            {" "}
            Width: {field.width} <br />{" "}
          </>
        )}
        {field.minWidth && (
          <>
            {" "}
            Min. Width: {field.minWidth} <br />{" "}
          </>
        )}
        {field.maxWidth && (
          <>
            {" "}
            Max. Width: {field.maxWidth} <br />{" "}
          </>
        )}
        {field.aspectRatio && (
          <>
            {" "}
            Aspect Ratio: {field.aspectRatio} <br />{" "}
          </>
        )}
        {field.allowedMimeTypes && (
          <>
            {" "}
            Mime Types:{" "}
            {field.allowedMimeTypes.map((type, index) => {
              if (index === field.allowedMimeTypes.length - 1) {
                return upperCase(type.split("/")[1])
              }
              return `${upperCase(type.split("/")[1])}, `
            })}
            <br />{" "}
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

export default ImageRequirements
