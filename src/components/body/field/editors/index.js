import AssetEditor from "./assetEditor"
import EnumEditor from "./enumEditor"
import NumberEditor from "./numberEditor"
import BooleanEditor from "./booleanEditor"
import StringEditor from "./stringEditor"
import IntegerEditor from "./integerEditor"

export default {
  audio: AssetEditor,
  boolean: BooleanEditor,
  enum: EnumEditor,
  image: AssetEditor,
  file: AssetEditor,
  markdown: StringEditor,
  integer: IntegerEditor,
  number: NumberEditor,
  string: StringEditor,
  video: AssetEditor
}
