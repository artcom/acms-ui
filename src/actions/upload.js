import { toLower } from "lodash"

import { sha256 } from "../utils/sha"

import { showError } from "./error"
import { setValue } from "./value"

export function uploadFile(path, file, acmsAssets) {
  return async (dispatch) => {
    function onUploadProgress(event) {
      dispatch(progressUpload(path, event.loaded / event.total))
    }

    try {
      dispatch(startUpload(path))
      const filename = await generateFilename(file)

      const url = await acmsAssets.uploadFile(filename, file, { onUploadProgress })

      dispatch(setValue(path, url))
    } catch (error) {
      dispatch(cancelUpload(path))
      dispatch(showError("Failed to Upload File", error.stack))
    }
  }
}

async function generateFilename(file) {
  const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2) ? `.${file.name.split('.').pop()}` : ""
  const name = file.name.replace(extension, "")
  const hash = await sha256(file)
  return toLower(`${name}-${hash}${extension}`.replace(/([^a-z0-9\-.])/gi, "_"))
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
