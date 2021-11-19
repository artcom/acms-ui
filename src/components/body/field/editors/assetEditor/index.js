import React from "react"
import styled from "styled-components"
import path from "path-browserify"
import ProgressBar from "react-bootstrap/ProgressBar"
import ImageEditor from "./imageEditor"
import FileSelector from "../fileSelector"

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
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
    case "video": return <Video controls key={ src } src={ src } />
    case "image": return <ImageEditor field={ field } />
  }
}

export function renderUpload(field, onFileSelect) {
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
