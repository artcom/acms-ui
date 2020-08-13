import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import path from "path"

import FileSelector from "../components/fileSelector"

export default function AssetEditor({ field, onFileSelect }) {
  return (
    <div>
      { field.value && renderView(field) }
      { renderUpload(field, onFileSelect) }
    </div>
  )
}

function renderView(field) {
  const src = field.value
  const style = { width: "100%" }

  const checkerboard = {
    width: "100%",
    backgroundImage: `
      linear-gradient(to right, rgba(150, 150, 150, 0.75), rgba(150, 150, 150, 0.75)),
      linear-gradient(to right, black 50%, white 50%),
      linear-gradient(to bottom, black 50%, white 50%)`,
    backgroundBlendMode: "normal, difference, normal",
    backgroundSize: "2em 2em"

  }
  switch (field.type) {
    case "audio": return <audio controls key={ src } src={ src } style={ style } />
    case "file": return <div key={ src } style={ style }>{ path.basename(src) }</div>
    case "image": return <img key={ src } src={ src } style={ checkerboard } />
    case "video": return <video controls key={ src } src={ src } style={ style } />
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
