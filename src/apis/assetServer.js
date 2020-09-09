import axios from "axios"
import URL from "url"

export default class AssetServer {
  constructor(url) {
    this.api = axios.create({ baseURL: url })
    this.url = url
  }

  async uploadFile(path, file, options) {
    if (!await this.exists(path)) {
      await this.api.put(path, file, options)
    }
    return URL.resolve(this.url, path)
  }

  async exists(path) {
    try {
      await this.api.request({ method: "PROPFIND", headers: { Depth: 0 }, url: path })
      return true
    } catch (error) {
      return false
    }
  }
}

