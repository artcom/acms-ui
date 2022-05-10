import get from "lodash/get"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

const MULTI_LINE_STYLE = { as: "textarea", rows: "3" }
const SINGLE_LINE_STYLE = { type: "text" }

export default function StringEditor({ field, onChange, textDirection }) {
  const maxLength = get(field, "maxLength", Infinity)
  const multiline = get(field, "multiline", false)
  const valid = field.value.length <= maxLength

  return (
    <>
      <StyledFormControl
        isInvalid={!valid}
        direction={textDirection}
        {...(multiline ? MULTI_LINE_STYLE : SINGLE_LINE_STYLE)}
        value={field.value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Form.Control.Feedback type="invalid" tooltip>
        Maximum length should be {maxLength}
      </Form.Control.Feedback>
    </>
  )
}
