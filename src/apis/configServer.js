import axios from "axios"

const DEFAULT_BRANCH = "master"

export default class ConfigServer {
  constructor(url) {
    this.api = axios.create({ baseURL: url })
  }

  async queryJson(path, version = DEFAULT_BRANCH) {
    const response = await this.api.get(`${version}/${path}`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"]
    }
  }

  async queryFiles(path, version = DEFAULT_BRANCH) {
    const response = await this.api.get(`${version}/${path}?listFiles=true`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"]
    }
  }

  async save(files, contentPath, version, updateBranch = DEFAULT_BRANCH) {
    await this.api.put(`${version}/${contentPath}`, { files, updateBranch })
  }
}
