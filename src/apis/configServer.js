import axios from "axios"

export default class ConfigServer {
  constructor(url = "/content") {
    this.api = axios.create({ baseURL: url })
  }

  async load(configPath) {
    const { data: config, version } = await this.queryJson(configPath)
    const { data: templates } = await this.queryFiles(config.templatesPath, version)
    const { data: content } = await this.queryJson(config.contentPath, version)

    return { config, content, templates, version }
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

  async save(content, templates, version) {
    await this.api.post(`${version}/content`, content)
  }
}
