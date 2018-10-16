import axios from "axios"

import AssetServer from "./apis/assetServer"
import GitJsonApi from "./apis/gitJsonApi"

export async function loadConfig() {
  const configFromEnv = {
    assetServer: process.env.ASSET_SERVER_URI,
    gitJsonApi: process.env.GIT_JSON_API_URI
  }

  const configFromJson = await loadConfigFromJson("config.json")

  const merged = { ...configFromEnv, ...configFromJson }

  return {
    assetServer: new AssetServer(merged.assetServer),
    gitJsonApi: new GitJsonApi(merged.gitJsonApi),
    whitelist: merged.whitelist
  }
}

async function loadConfigFromJson(path) {
  try {
    const response = await axios.get(path)
    return response.data
  } catch (error) {
    return {}
  }
}
