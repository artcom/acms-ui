import React, { useEffect, useRef } from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import styled from "styled-components"
import path from "path-browserify"
import FileSelector from "./fileSelector"
import imageValidator from "../../../../utils/imageValidator"

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const Image = styled.img`
    max-width: 100%;
    background-image: 
      linear-gradient(to right, rgba(150, 150, 150, 0.75), rgba(150, 150, 150, 0.75)),
      linear-gradient(to right, black 50%, white 50%),
      linear-gradient(to bottom, black 50%, white 50%);
    background-blend-mode: normal, difference, normal;
    background-size: 2em 2em;
`

const File = styled.div`
    font-size: 0.7rem;
    line-height: 2.5;
    text-align: center;
`

const Audio = styled.audio`
    width: 100%;   
`

const Video = styled.video`
    width: 100%;   
`

const Invalid = styled.div` // copied from bootstrap styles
    position: absolute;
    top: 0;
    z-index: 5;
    max-width: 100%;
    padding: .25rem .5rem;
    margin-top: .1rem;
    font-size: .875rem;
    line-height: 1.5;
    color: #fff;
    background-color: rgba(220,53,69,.9);
    border-radius: .25rem;
`

export default function AssetEditor({ field, onFileSelect }) {
  return (
    <Editor >
      { field.value && renderView(field) }
      { renderUpload(field, onFileSelect) }
    </Editor>
  )
}

function renderView(field) {
  const src = field.value
  let valid = true
  const imageRef = useRef(null)

  if (field.type === "image") {
    const restrictions = { width: field.width, heigth: field.heigth,
      maxWidth: field.maxWidth, maxHeight: field.maxHeight,
      minWidth: field.minWidth, minHeight: field.minHeight,
      aspectRatio: field.aspectRatio }
    useEffect(() => {
      valid = imageValidator(imageRef.current, restrictions)
    }, [imageRef])
  }

  switch (field.type) {
    case "audio": return <Audio controls key={ src } src={ src } />
    case "file": return <File key={ src }>{ path.basename(src) }</File>
    case "image":
      return (
        <>
          <Image key={ src } src={ src } ref={ imageRef } />
          { !valid && <Invalid>Invalid image - Please check restrictions</Invalid> }
        </>)
    case "video": return <Video controls key={ src } src={ src } />
  }
}

function renderUpload(field, onFileSelect) {
  if (field.progress !== undefined) {
    return <ProgressBar min={ 0 } max={ 1 } now={ field.progress } />
  } else {
    const accept = field.type === "file" ? "" : `${field.type}/*`

    return (
      <FileSelector accept={ accept } onSelect={ onFileSelect }>
        <div>Drop { field.type } here, or click to open file dialog.</div>
      </FileSelector>
    )
  }
}
