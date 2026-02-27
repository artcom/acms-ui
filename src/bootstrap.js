import AcmsApi from "./apis/acmsApi"
import AcmsAssets from "./apis/acmsAssets"

export default async () => {
  const response = await fetch("config.json")

  if (response.ok) {
    const { acmsApiUri, acmsAssetsUri, acmsConfigPath, defaultBranch = "main" } = await response.json()

    const acmsApi = new AcmsApi(acmsApiUri, defaultBranch)
    const acmsAssets = new AcmsAssets(acmsAssetsUri)

    return { acmsApi, acmsAssets, acmsConfigPath }
  } else {
    throw new Error(response.statusText)
  }
}
