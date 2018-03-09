import axios from "axios"
import querystring from "querystring"

import AssetServer from "./apis/assetServer"
import GitJsonApi from "./apis/gitJsonApi"

export async function loadConfig() {
  const config = {
    assetServer: process.env.ASSET_SERVER_URI,
    gitJsonApi: process.env.GIT_JSON_API_URI
  }
  const params = querystring.parse(window.location.search.substring(1))
  const merged = { ...config, ...params }

  return {
    assetServer: new AssetServer(merged.assetServer),
    gitJsonApi: new GitJsonApi(merged.gitJsonApi),
    whitelist: merged.whitelist
  }
}
