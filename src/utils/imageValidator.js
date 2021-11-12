export default function imageValidator(file,
  { width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight,
    aspectRatio }) {
  return (
    !(width && file.width !== width ||
        height && file.height !== height ||
        maxWidth && file.width > maxWidth ||
        minWidth && file.width < minWidth ||
        maxHeight && file.heigth > maxHeight ||
        minHeight && file.heigth < minHeight ||
        aspectRatio && file.width / file.height !== aspectRatio))
}

