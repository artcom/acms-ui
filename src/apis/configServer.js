import axios from "axios"

export default class ConfigServer {
  constructor(url = "/content") {
    this.api = axios.create({ baseURL: url })
  }

  async queryJson(path, version = "master") {
    const response = await this.api.get(`${version}/${path}`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"]
    }
  }

  async queryFiles(path, version = "master") {
    const response = await this.api.get(`${version}/${path}?listFiles=true`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"]
    }
  }

  async updateContent(content, version) {
    await this.api.post(`${version}/content`, content)
  }
}
