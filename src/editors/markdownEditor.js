import React from "react"
import Form from "react-bootstrap/Form"


export default function MarkdownEditor({ field, onChange }) {
  return (
    <Form.Control
      style={ { border: "0px", boxShadow: "none" } }
      componentClass="textarea"
      rows={ 8 }
      value={ field.value }
      onChange={ onChange } />
  )
}
