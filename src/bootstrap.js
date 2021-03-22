import AcmsAssets from "./apis/acmsAssets"
import AcmsApi from "./apis/acmsApi"

export default async () => {
  const response = await fetch("config.json")

  if (response.ok) {
    const { acmsAssetsUri, acmsApiUri, cmsConfigPath } = await response.json()

    const acmsAssets = new AcmsAssets(acmsAssetsUri)
    const acmsApi = new AcmsApi(acmsApiUri)

    return { acmsAssets, acmsApi, cmsConfigPath }
  } else {
    throw new Error(response.statusText)
  }
}
