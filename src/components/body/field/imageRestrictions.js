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
  return (
    <FontSize className="text-muted">
      <Container>
        { field.height && <div> height: { field.height }</div> }
        { field.maxHeight && <div> maxHeight: { field.maxHeight }</div> }
        { field.minHeight && <div> minHeight: { field.minHeight }</div> }
      </Container>
      <Container>
        { field.width && <div> width: { field.width }</div> }
        { field.maxWidth && <div> maxWidth: { field.maxWidth }</div> }
        { field.minWidth && <div> minWidth: { field.minWidth }</div> }
      </Container>
      <Container>
        { field.aspectRatio && `aspect ratio: ${field.aspectRatio}` }
      </Container>
    </FontSize>
  )
}
