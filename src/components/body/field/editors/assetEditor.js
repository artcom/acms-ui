import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import styled from "styled-components"
import path from "path-browserify"

import FileSelector from "./fileSelector"

const Editor = styled.div`
  display: flex;
  flex-direction: column;
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

  switch (field.type) {
    case "audio": return <Audio controls key={ src } src={ src } />
    case "file": return <File key={ src }>{ path.basename(src) }</File>
    case "image": return <Image key={ src } src={ src } />
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
