import axios from "axios"

import AssetServer from "./apis/assetServer"
import ConfigServer from "./apis/configServer"

export default async () => {
  try {
    const config = await axios.get("config.json")
    const { assetServerUri, configServerUri, cmsConfigPath } = config.data
    const assetServer = new AssetServer(assetServerUri)
    const configServer = new ConfigServer(configServerUri)
    return { assetServer, cmsConfigPath, configServer }
  } catch (error) {
    const assetServerUri = process.env.ASSET_SERVER_URI
    const configServerUri = process.env.CONFIG_SERVER_URI
    const cmsConfigPath = process.env.CMS_CONFIG_PATH
    const assetServer = new AssetServer(assetServerUri)
    const configServer = new ConfigServer(configServerUri)
    return { assetServer, cmsConfigPath, configServer }
  }
}
