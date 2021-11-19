import React from "react"
import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: -1rem 0 -1rem 2rem;
`
const Restrictions = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
`

export default function ImageRestrictions({ field }) {
  return (
    <Restrictions className="text-muted">
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
    </Restrictions>
  )
}
