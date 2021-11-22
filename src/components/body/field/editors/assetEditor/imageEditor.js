import React, { useRef, useState } from "react"
import styled from "styled-components"
import Form from "react-bootstrap/Form"

const Image = styled.img`
    max-width: 100%;
    background-image: 
      linear-gradient(to right, rgba(150, 150, 150, 0.75), rgba(150, 150, 150, 0.75)),
      linear-gradient(to right, black 50%, white 50%),
      linear-gradient(to bottom, black 50%, white 50%);
    background-blend-mode: normal, difference, normal;
    background-size: 2em 2em;
`

// extracted style from bootstrap with additional
// attributes to make it work outside of FormGroup
// todo add attributes
const Invalid = styled(Form.Control.Feedback).attrs({
  type: "invalid",
  tooltip: true
})`
    top: 0;
    display: block;
`

const Container = styled.div`
    position: relative;
`


export default function ImageEditor({ field }) {
  const imageRef = useRef(null)
  const [valid, setValid] = useState(true)
  const src = field.value

  const handleImageLoad = () => {
    setValid(imageValidator({ fileWidth: imageRef.current.naturalWidth,
      fileHeight: imageRef.current.naturalHeight }, field))
  }

  return (
    <Container>
      <Image key={ src } src={ src } ref={ imageRef } onLoad={ handleImageLoad } />
      { !valid &&
      <Invalid>
        Warning - image does not meet requirements
      </Invalid> }
    </Container>)
}

function imageValidator({ fileWidth, fileHeight },
  { width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight,
    aspectRatio }) {
  if (width && width !== fileWidth) {
    return false
  }
  if (height && height !== fileHeight) {
    return false
  }
  if (minWidth && fileWidth < minWidth) {
    return false
  }
  if (maxWidth && fileWidth > maxWidth) {
    return false
  }
  if (minHeight && fileHeight < minHeight) {
    return false
  }
  if (maxHeight && fileHeight > maxHeight) {
    return false
  }
  if (aspectRatio && aspectRatio.split(":").map(Number)
    .reduce((a, b) => a / b) !== fileWidth / fileHeight) {
    return false
  }
  return true
}

