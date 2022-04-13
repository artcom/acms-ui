
export function listAllFiles(acmsAssets) {
  return async () => {
    try {
      const files = await acmsAssets.listAllFiles()
<<<<<<< HEAD

      console.log("ALL FILES", files)
=======
      return files
>>>>>>> 47a245519cd186aea229d34e734b097dc2cce9ba
    } catch (error) {
      console.error(error)
    }
  }
}
