import React from "react"
import isString from "lodash/isString"
import startCase from "lodash/startCase"

import StyledFormSelect from "./styledFormSelect"


export default function EnumEditor({ field, onChange }) {
  const values = isString(field.values[0])
    ? field.values.map(id => ({ id, name: startCase(id) }))
    : field.values

  return (
    <StyledFormSelect
      value={ field.value }
      onChange={ event => onChange(event.target.value) }>
      { values.map(({ id, name }, index) =>
        <option key={ index } value={ id }>{ name }</option>
      ) }
    </StyledFormSelect>
  )
}
