import React from "react"
import { Glyphicon, ProgressBar } from "react-bootstrap"
import path from "path"

import FileSelector from "../components/fileSelector"

const PLACEHOLDER_GLYPH = {
  audio: "music",
  file: "file",
  image: "picture",
  video: "facetime-video"
}

export default function AssetEditor({ config, field, onFileSelect }) {
  return (
    <div>
      { field.value ? renderView(field, config) : renderPlaceholder(field) }
      <hr />
      { renderUpload(field, onFileSelect) }
    </div>
  )
}

function renderView(field, config) {
  const key = field.value.get("src")
  const src = config.assetServer.assetUrl(key)
  const style = { width: "100%" }

  const checkerboard = {
    backgroundImage:
                `linear-gradient(to right, rgba(192, 192, 192, 0.75), rgba(192, 192, 192, 0.75)),
                linear-gradient(to right, black 50%, white 50%),
                linear-gradient(to bottom, black 50%, white 50%)`,
    backgroundBlendMode: "normal, difference, normal",
    backgroundSize: "2em 2em"

  }
  switch (field.type) {
    case "audio": return <audio controls key={ key } src={ src } style={ style } />
    case "file": return <div key={ key } style={ style }>{ path.basename(key) }</div>
    case "image": return <img key={ key } src={ src } style={ checkerboard } />
    case "video": return <video controls key={ key } src={ src } style={ style } />
  }
}

function renderPlaceholder(field) {
  const glyph = PLACEHOLDER_GLYPH[field.type]
  return <Glyphicon glyph={ glyph } style={ { width: "100%", textAlign: "center" } } />
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
