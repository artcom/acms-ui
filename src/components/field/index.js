import React from "react"

import Card from "react-bootstrap/Card"
import FieldHeader from "./fieldHeader"
import FieldContent from "./fieldContent"

import editors from "../editors"

export default function Field(props) {
  const style = fieldStyle(props.field)

  return (
    <Card border={ style } className="mb-3">
      <Card.Header className={ style ? `list-group-item-${style}` : "" }>
        <FieldHeader { ...props } />
      </Card.Header>
      <FieldContent { ...props } />
    </Card>
  )
}

function fieldStyle({ hasChanged, isNew, type }) {
  if (isNew) {
    return "success"
  }

  if (!editors[type]) {
    return "danger"
  }

  if (hasChanged) {
    return "warning"
  }
}
