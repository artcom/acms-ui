export default function imageValidator({ fileWidth, fileHeight },
  { width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight,
    aspectRatio }) {
  if (width && width > maxWidth) {
    return false
  } else if (width && width < minWidth) {
    return false
  } else if (height && height > maxHeight) {
    return false
  } else if (height && height < minHeight) {
    return false
  } else if (aspectRatio &&
    parseFloat((fileWidth / fileHeight).toFixed(2)) !== parseFloat(aspectRatio)) {
    return false
  }
  return true
}

