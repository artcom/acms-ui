import AcmsApi from "./apis/acmsApi"
import AcmsAssets from "./apis/acmsAssets"

export default async () => {
  const response = await fetch("config.json")

  if (response.ok) {
    const { acmsApiUri, acmsAssetsUri, acmsConfigPath } = await response.json()

    const acmsApi = new AcmsApi(acmsApiUri)
    const acmsAssets = new AcmsAssets(acmsAssetsUri)

    return { acmsApi, acmsApiUri, acmsAssets, acmsAssetsUri, acmsConfigPath }
  } else {
    throw new Error(response.statusText)
  }
}
