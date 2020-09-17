import React from "react"
import isString from "lodash/isString"
import startCase from "lodash/startCase"
import styled from "styled-components"

import StyledFormControl from "./styledFormControl"

// this is a workaround style because the "custom" property
// supported by bootstrap is not working with Styled Components
const StyledSelectControl = styled(StyledFormControl)`
  appearance: none;
  background: #fff url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E") no-repeat right .75rem center/8px 10px;
`

export default function EnumEditor({ field, onChange }) {
  function onChangeEnum(event) {
    onChange({
      target: {
        value: event.target.value
      }
    })
  }

  const values = isString(field.values[0])
    ? field.values.map(id => ({ id, name: startCase(id) }))
    : field.values

  return (
    <StyledSelectControl
      as="select"
      value={ field.value }
      onChange={ onChangeEnum }>
      { values.map(({ id, name }, index) =>
        <option key={ index } value={ id }>{ name }</option>
      ) }
    </StyledSelectControl>
  )
}
