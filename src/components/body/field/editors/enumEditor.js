import React from "react"
import isString from "lodash/isString"
import startCase from "lodash/startCase"
import styled from "styled-components"

import StyledFormControl from "./styledFormControl"

// this is a workaround style because the "custom" property
// supported by bootstrap is not working with Styled Components
const StyledSelectControl = styled(StyledFormControl)`
  appearance: none;
  background: #fff url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolyline stroke='%23000' stroke-width='2' fill='none' points='1,4 5,8 9,4'/%3E%3C/svg%3E") no-repeat right .75rem center/8px 20px;
`

export default function EnumEditor({ field, onChange }) {
  const values = isString(field.values[0])
    ? field.values.map(id => ({ id, name: startCase(id) }))
    : field.values

  return (
    <StyledSelectControl
      as="select"
      value={ field.value }
      onChange={ event => onChange(event.target.value) }>
      { values.map(({ id, name }, index) =>
        <option key={ index } value={ id }>{ name }</option>
      ) }
    </StyledSelectControl>
  )
}
