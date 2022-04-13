
export function listAllFiles(acmsAssets) {
  return async () => {
    try {
      const files = await acmsAssets.listAllFiles()

      console.log("ALL FILES", files)
    } catch (error) {
      console.error(error)
    }
  }
}
