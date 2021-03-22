import AssetServer from "./apis/assetServer"
import AcmsApi from "./apis/acmsApi"

export default async () => {
  const response = await fetch("config.json")

  if (response.ok) {
    const { acmsAssetsUri, acmsApiUri, cmsConfigPath } = await response.json()

    const assetServer = new AssetServer(acmsAssetsUri)
    const acmsApi = new AcmsApi(acmsApiUri)

    return { assetServer, cmsConfigPath, acmsApi }
  } else {
    throw new Error(response.statusText)
  }
}
