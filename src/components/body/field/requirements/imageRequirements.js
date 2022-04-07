import React from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import RequirementIcon from "./requirementIcon"

const ImageRequirements = ({ field }) => {
  const hasRequirements = field.heigth || field.minHeight || field.maxHeight ||
    field.width || field.minWidth || field.maxWidth || field.aspectRatio

  if (!hasRequirements) {
    return null
  }
  const Tooltip =
    <Popover>
      <Popover.Header>Image Requirements</Popover.Header>
      <Popover.Body>
        { field.height && <> Height: { field.height } <br /> </> }
        { field.minHeight && <> Min. Height: { field.minHeight } <br /> </> }
        { field.maxHeight && <> Max. Height: { field.maxHeight } <br /> </> }
        { field.width && <> Width: { field.width } <br /> </> }
        { field.minWidth && <> Min. Width: { field.minWidth } <br /> </> }
        { field.maxWidth && <> Max. Width: { field.maxWidth } <br /> </> }
        { field.aspectRatio && <> Aspect Ratio: { field.aspectRatio } <br /> </> }
      </Popover.Body>
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

export default ImageRequirements
