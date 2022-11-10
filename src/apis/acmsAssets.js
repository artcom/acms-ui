import axios from "axios"
import urlJoin from "url-join"

export default class AcmsAssets {
  constructor(url) {
    this.api = axios.create({ baseURL: url })
    this.url = url
  }

  async uploadFile(path, file, options) {
    if (!(await this.exists(path))) {
      await this.api.put(path, file, options)
    }

    return urlJoin(this.url, path)
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
