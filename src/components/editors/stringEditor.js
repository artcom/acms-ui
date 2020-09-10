import Form from "react-bootstrap/Form"
import get from "lodash/get"
import React from "react"

import { isValidField } from "../../utils"

const MULTI_LINE_STYLE = { as: "textarea", rows: "3" }
const SINGLE_LINE_STYLE = { type: "text" }


export default function StringEditor({ field, onChange }) {
  const maxLength = get(field, "maxLength", Infinity)
  const multiline = get(field, "multiline", false)
  const valid = isValidField(field.value, field)


  return (
    <>
      <Form.Control
        style={ { border: "0px", boxShadow: "none" } }
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
