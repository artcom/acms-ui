import ImageRequirements from "./imageRequirements"
import StringRequirements from "./stringRequirements"
import NumberRequirements from "./numberRequirements"

export default {
  image: ImageRequirements,
  string: StringRequirements,
  number: NumberRequirements,
  audio: () => null,
  boolean: () => null,
  enum: () => null,
  file: () => null,
  markdown: () => null,
  video: () => null,
}
