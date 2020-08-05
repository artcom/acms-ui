import { getChangedContent, getVersion } from "../selectors"

import { showError } from "./error"

export function loadData(configServer, cmsConfigPath) {
  return async dispatch => {
    try {
      const { data: config, version } = await configServer.queryJson(cmsConfigPath)
      const { data: templates } = await configServer.queryFiles(config.templatesPath, version)
      const { data: content } = await configServer.queryJson(config.contentPath, version)

      dispatch(updateData(config, content, templates, version))
    } catch (error) {
      dispatch(showError("Failed to Load Data", error))
    }
  }
}

export function saveData(configServer) {
  return async (dispatch, getState) => {
    const state = getState()
    const version = getVersion(state)
    const content = getChangedContent(state)

    try {
      dispatch(startSaving())
      await configServer.updateContent(content.toJS(), version)
      dispatch(loadData(configServer))
    } catch (error) {
      dispatch(showError("Failed to Save Data", error))
    }
  }
}

function startSaving() {
  return {
    type: "START_SAVING"
  }
}

function updateData(config, content, templates, version) {
  return {
    type: "UPDATE_DATA",
    payload: {
      config,
      content,
      templates,
      version
    }
  }
}
