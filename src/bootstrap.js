import axios from "axios"

import AssetServer from "./apis/assetServer"
import ConfigServer from "./apis/configServer"

export default async () => {
  const configFromEnv = {
    assetServerUri: process.env.ASSET_SERVER_URI,
    configServerUri: process.env.CONFIG_SERVER_URI,
    cmsConfigPath: process.env.CMS_CONFIG_PATH
  }

  const configFromJson = await loadConfigFromJson("config.json")
  const config = { ...configFromEnv, ...configFromJson }

  const assetServer = new AssetServer(config.assetServerUri)
  const configServer = new ConfigServer(config.configServerUri)

  return { assetServer, cmsConfigPath: config.cmsConfigPath, configServer }
}

async function loadConfigFromJson(path) {
  try {
    const response = await axios.get(path)
    return response.data
  } catch (error) {
    return {}
  }
}
