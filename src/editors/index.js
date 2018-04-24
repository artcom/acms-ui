import AssetEditor from "./assetEditor"
import EnumEditor from "./enumEditor"
import MarkdownEditor from "./markdownEditor"
import NumberEditor from "./numberEditor"
import BooleanEditor from "./booleanEditor"
import StringEditor from "./stringEditor"

export default {
  audio: AssetEditor,
  boolean: BooleanEditor,
  enum: EnumEditor,
  image: AssetEditor,
  file: AssetEditor,
  markdown: MarkdownEditor,
  number: NumberEditor,
  string: StringEditor,
  video: AssetEditor
}
