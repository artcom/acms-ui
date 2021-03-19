import AssetServer from "./apis/assetServer"
import ConfigServer from "./apis/configServer"

export default async () => {
  const response = await fetch("config.json")

  if (response.ok) {
    const { assetServerUri, configServerUri, cmsConfigPath } = await response.json()

    const assetServer = new AssetServer(assetServerUri)
    const configServer = new ConfigServer(configServerUri)

    return { assetServer, cmsConfigPath, configServer }
  } else {
    throw new Error(response.statusText)
  }
}
