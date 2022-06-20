import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"

import path from "path-browserify"

import { InfoLg } from "react-bootstrap-icons"

const ImageRequirements = ({ field }) => {
  const hasRequirements =
    field.heigth ||
    field.minHeight ||
    field.maxHeight ||
    field.width ||
    field.minWidth ||
    field.maxWidth ||
    field.aspectRatio

  const hasInfos = field.value.hashedPath !== "" || field.value.lastModified !== ""

  if (!hasRequirements && !hasInfos) {
    return null
  }
  const Tooltip = (
    <Popover>
      {hasRequirements && (
        <div>
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
          </Popover.Body>
        </div>
      )}
      {hasInfos && (
        <div>
          <Popover.Header>Image Infos</Popover.Header>
          <Popover.Body>
            {field.value.hashedPath !== "" && (
              <>
                {" "}
                Name: {path.basename(field.value.hashedPath).split("-")[0]} <br />{" "}
              </>
            )}
            {field.value.lastModified !== "" && (
              <>
                {" "}
                Last modified: {field.value.lastModified} <br />{" "}
              </>
            )}
          </Popover.Body>
        </div>
      )}
    </Popover>
  )

  return (
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={Tooltip}>
      <InfoLg size={25} opacity={0.6} />
    </OverlayTrigger>
  )
}

export default ImageRequirements
