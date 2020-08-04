import axios from "axios"

import AssetServer from "./apis/assetServer"
import ConfigServer from "./apis/configServer"

export default async () => {
  const {
    assetServerUri = process.env.ASSET_SERVER_URI,
    configServerUri = process.env.CONFIG_SERVER_URI,
    cmsConfigPath = process.env.CMS_CONFIG_PATH
  } = await axios.get("config.json").then(data => data).catch(() => ({}))

  const assetServer = new AssetServer(assetServerUri)
  const configServer = new ConfigServer(configServerUri)

  return { assetServer, cmsConfigPath, configServer }
}
