import React, { useRef, useState } from "react"
import styled from "styled-components"
import Form from "react-bootstrap/Form"
import imageValidator from "../../../../../utils/imageValidator"

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
const Invalid = styled(Form.Control.Feedback)` 
    top: 0;
    display: block;
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
    <>
      <Image key={ src } src={ src } ref={ imageRef } onLoad={ handleImageLoad } />
      { !valid &&
      <Invalid type="invalid" tooltip>
        Invalid image - Please check restrictions
      </Invalid> }
    </>)
}

