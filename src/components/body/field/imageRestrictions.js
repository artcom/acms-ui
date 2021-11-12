import React from "react"
import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 25px; 
`
const FontSize = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    color: #828282;
`

export default function ImageRestrictions({ field }) {
  const height = field.height
  const width = field.width
  const maxHeight = field.maxHeight
  const maxWidth = field.maxWidth
  const minHeight = field.minHeight
  const minWidth = field.minWidth
  const aspectRatio = field.aspectRatio
  return (
    <FontSize className="text-muted">
      restrictions
      <Container>
        { height && <div> heigth: { height }</div> }
        { maxHeight && <div> maxWidth: { maxHeight }</div> }
        { minHeight && <div> minWidth: { minHeight }</div> }
      </Container>
      <Container>
        { width && <div> width: { width }</div> }
        { maxWidth && <div> maxWidth: { maxWidth }</div> }
        { minWidth && <div> minWidth: { minWidth }</div> }
      </Container>
      <Container>
        { aspectRatio && `aspect ratio: ${aspectRatio}` }
      </Container>
    </FontSize>
  )
}
