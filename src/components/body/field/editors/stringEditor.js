import get from "lodash/get"
import React from "react"
import Form from "react-bootstrap/Form"
import styled from "styled-components"

import StyledFormControl from "./styledFormControl"

const MULTI_LINE_STYLE = { as: "textarea", rows: "3" }
const SINGLE_LINE_STYLE = { type: "text" }

const StringFormControl = styled(StyledFormControl).withConfig({
  // eslint-disable-next-line no-unused-vars
  shouldForwardProp: (prop, defaultValidatorFn) => !["textDirection", "isInvalid"].includes(prop),
})`
    direction: ${props => props.textDirection};
`

export default function StringEditor({ field, onChange, textDirection }) {
  const maxLength = get(field, "maxLength", Infinity)
  const multiline = get(field, "multiline", false)
  const valid = field.value.length <= get(field, "maxLength", Infinity)

  return (
    <>
      <StringFormControl
        isInvalid={ !valid }
        textDirection={ textDirection }
        { ...(multiline ? MULTI_LINE_STYLE : SINGLE_LINE_STYLE) }
        value={ field.value }
        onChange={ onChange } />
      <Form.Control.Feedback type="invalid" tooltip>
        Maximum length should be { maxLength }
      </Form.Control.Feedback>
    </>
  )
}
