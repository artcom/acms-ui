import axios from "axios"

const DEFAULT_BRANCH = "master"

export default class AcmsApi {
  constructor(url, defaultBranch = DEFAULT_BRANCH) {
    this.api = axios.create({ baseURL: url })
    console.log("ACMS API URL:", url)
    console.log("ACMS API Default Branch:", defaultBranch)
    this.defaultBranch = defaultBranch
  }

  async queryJson(path, version = this.defaultBranch) {
    const response = await this.api.get(`${version}/${path}`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"],
    }
  }

  async queryFiles(path, version = this.defaultBranch) {
    const response = await this.api.get(`${version}/${path}?listFiles=true`)

    return {
      data: response.data,
      version: response.headers["git-commit-hash"],
    }
  }

  async save(files, contentPath, version, updateBranch = this.defaultBranch) {
    await this.api.put(`${version}/${contentPath}`, { files, updateBranch })
  }
}
