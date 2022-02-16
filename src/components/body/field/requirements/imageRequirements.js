import React from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"

const ImageRequirements = ({ field }) => {
  const hasRequirements = field.heigth || field.minHeight || field.maxHeight ||
    field.width || field.minWidth || field.maxWidth || field.aspectRatio

  if (!hasRequirements) {
    return null
  }

  const Icon = props =>
    <div { ...props }>
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fillOpacity="0.6"
        fill="currentColor" className="bi bi-info-lg" viewBox="0 0 16 16">
        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255
      1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363
      0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64
      0Z" />
      </svg>
    </div>

  const Tooltip =
    <Popover>
      <Popover.Title>Image Requirements</Popover.Title>
      <Popover.Content>
        { field.height && <> Height: { field.height } <br /> </> }
        { field.minHeight && <> Min. Height: { field.minHeight } <br /> </> }
        { field.maxHeight && <> Max. Height: { field.maxHeight } <br /> </> }
        { field.width && <> Width: ${ field.width } <br /> </> }
        { field.minWidth && <> Min. Width: { field.minWidth } <br /> </> }
        { field.maxWidth && <> Max. Width: { field.maxWidth } <br /> </> }
        { field.aspectRatio && <> Aspect Ratio: { field.aspectRatio } <br /> </> }
      </Popover.Content>
    </Popover>

  return (
    <OverlayTrigger
      placement="bottom"
      delay={ { show: 250, hide: 400 } }
      overlay={ Tooltip }>
      <Icon />
    </OverlayTrigger>
  )
}

export default ImageRequirements
