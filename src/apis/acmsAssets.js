import axios from "axios"
import * as urlJoin from "url-join"
import * as convert from "xml-js"

const getHrefComponents = href => {
  const components = href.match(/^\/?(\S+)-(\S+)\.(\w+)$/)
  return {
    name: components[1],
    hash: components[2],
    ext: components[3]
  }
}

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
      const resJson = convert.xml2json(res.data, { compact: true, spaces: 2, textKey: "text",
        elementNameFn: val => val.replace("D:", "")
      })
      // const { multistatus: { response: files } } = resJson
      const { multistatus: { response: rawFiles } } = JSON.parse(resJson)
      const files = rawFiles.filter(f => f.href.text !== "/").map(f => {
        const { name, ext } = getHrefComponents(f.href.text)
        return {
          path: f.href.text,
          originalName: `${name}.${ext}`
        }
      })
      return files
    } catch (error) {
      return false
    }
  }
}

