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

  const imageValidator = () => {
    if (field.width && field.width !== imageRef.current.naturalWidth) {
      return false
    }
    if (field.height && field.height !== imageRef.current.naturalHeight) {
      return false
    }
    if (field.minWidth && imageRef.current.naturalWidth < field.minWidth) {
      return false
    }
    if (field.maxWidth && imageRef.current.naturalWidth > field.maxWidth) {
      return false
    }
    if (field.minHeight && imageRef.current.naturalHeight < field.minHeight) {
      return false
    }
    if (field.maxHeight && imageRef.current.naturalHeight > field.maxHeight) {
      return false
    }
    if (field.aspectRatio && field.aspectRatio.split(":").map(Number)
      .reduce((a, b) => a / b) !== imageRef.current.naturalWidth / imageRef.current.naturalHeight) {
      return false
    }
    return true
  }

  return (
    <Container>
      <Image key={ src } src={ src } ref={ imageRef } onLoad={ setValid(imageValidator()) } />
      { !valid &&
      <Invalid>
        Warning - image does not meet requirements
      </Invalid> }
    </Container>)
}

