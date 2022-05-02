
export function listAllFiles(acmsAssets) {
  return async () => {
    try {
      const files = await acmsAssets.listAllFiles("")
      return files
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
