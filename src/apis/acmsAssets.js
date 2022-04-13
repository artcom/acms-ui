import axios from "axios"
import * as urlJoin from "url-join"
import * as convert from "xml-js"

export default class AcmsAssets {
  constructor(url) {
    this.api = axios.create({ baseURL: url })
    this.url = url
  }

  async uploadFile(path, file, options) {
    if (!await this.exists(path)) {
      await this.api.put(path, file, options)
    }

    return urlJoin(this.url, path)
  }

  async exists(path) {
    try {
      await this.api.request({ method: "PROPFIND", headers: { Depth: 1 }, url: path })
      return true
    } catch (error) {
      return false
    }
  }

  async listAllFiles(path) {
    try {
      const res =
        await this.api.request({
          method: "PROPFIND",
          propFind: {
            propName: "",
          },
          headers: { Depth: 1 },
          url: path })
      // const res = await this.api.request({ method: "PROPFIND", headers: {}, url: path })
      return convert.xml2json(res.data, { compact: true, spaces: 2 })
    } catch (error) {
      return false
    }
  }
}
