import get from "lodash/get"
import React from "react"
import Form from "react-bootstrap/Form"
import StyledFormControl from "./styledFormControl"

import { isValidField } from "../../../../utils"

const MULTI_LINE_STYLE = { as: "textarea", rows: "3" }
const SINGLE_LINE_STYLE = { type: "text" }

export default function StringEditor({ field, onChange }) {
  const maxLength = get(field, "maxLength", Infinity)
  const multiline = get(field, "multiline", false)
  const valid = isValidField(field.value, field)

  return (
    <>
      <StyledFormControl
        isInvalid={ !valid }
        { ...(multiline ? MULTI_LINE_STYLE : SINGLE_LINE_STYLE) }
        value={ field.value }
        onChange={ onChange } />
      <Form.Control.Feedback type="invalid" tooltip>
        Maximum length should be { maxLength }
      </Form.Control.Feedback>
    </>
  )
}
