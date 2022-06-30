import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import { upperCase } from "lodash"

import { useState } from "react"

import styled from "styled-components"

import { InfoLg } from "react-bootstrap-icons"

const StyledPopoverHeader = styled(Popover.Header)`
  border-top: 1px solid lightgrey;
  border-radius: 0px;
`

const ImageRequirements = ({ field }) => {
  const [showPopover, setShowPopover] = useState(false)

  const handleOnMouseEnter = () => {
    setShowPopover(true)
  }
  const handleOnMouseLeave = () => {
    setShowPopover(false)
  }

  const hasRequirements =
    field.heigth ||
    field.minHeight ||
    field.maxHeight ||
    field.width ||
    field.minWidth ||
    field.maxWidth ||
    field.aspectRatio ||
    field.allowedMimeTypes

  const hasInfos =
    field.value.path !== "" || field.value.lastModified !== "" || field.value.filename !== ""

  if (!hasRequirements && !hasInfos) {
    return null
  }
  const Tooltip = (
    <Popover onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
      {hasRequirements && (
        <>
          <Popover.Header>Requirements</Popover.Header>
          <Popover.Body>
            {field.height && (
              <>
                Height: {field.height} <br />
              </>
            )}
            {field.minHeight && (
              <>
                Min. Height: {field.minHeight} <br />
              </>
            )}
            {field.maxHeight && (
              <>
                Max. Height: {field.maxHeight} <br />
              </>
            )}
            {field.width && (
              <>
                Width: {field.width} <br />
              </>
            )}
            {field.minWidth && (
              <>
                Min. Width: {field.minWidth} <br />
              </>
            )}
            {field.maxWidth && (
              <>
                Max. Width: {field.maxWidth} <br />
              </>
            )}
            {field.aspectRatio && (
              <>
                Aspect Ratio: {field.aspectRatio} <br />
              </>
            )}
            {field.allowedMimeTypes && (
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
            )}
          </Popover.Body>
        </>
      )}
      {hasInfos && (
        <>
          <StyledPopoverHeader>Infos</StyledPopoverHeader>
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

export default ImageRequirements
