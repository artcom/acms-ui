import { basename, extname } from "path"

import { sha256 } from "../sha"

import { showError } from "./error"
import { changeValue } from "./value"

export function uploadFile(path, file, assetServer) {
  return async dispatch => {
    function onUploadProgress(event) {
      dispatch(progressUpload(path, event.loaded / event.total))
    }

    try {
      dispatch(startUpload(path))
      const filename = await generateFilename(file)

      const url = await assetServer.uploadFile(filename, file, { onUploadProgress })

      dispatch(changeValue(path, url))
    } catch (error) {
      dispatch(cancelUpload(path))
      dispatch(showError("Failed to Upload File", error))
    }
  }
}

async function generateFilename(file) {
  const extension = extname(file.name)
  const name = basename(file.name, extension)
  const hash = await sha256(file)
  return `${name}-${hash}${extension}`.replace(/([^a-z0-9\-.])/gi, "_")
}

function startUpload(path) {
  return { type: "START_UPLOAD", payload: { path } }
}

function progressUpload(path, progress) {
  return { type: "PROGRESS_UPLOAD", payload: { path, progress } }
}

function cancelUpload(path) {
  return { type: "CANCEL_UPLOAD", payload: { path } }
}
