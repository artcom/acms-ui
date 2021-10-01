import startCase from "lodash/startCase"
import React from "react"

import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import styled from "styled-components"

import { undoChanges } from "../../../actions/value"

import ToggleButton from "../../toggleButton"

const StyledDropdown = styled(Dropdown)`
  float: right;
`

const FieldHeader = ({ field, dispatch }) =>
  <div>
    { field.name ? field.name : startCase(field.id) }

    <StyledDropdown id={ field.id }>
      <Dropdown.Toggle as={ ToggleButton } />
      <Dropdown.Menu>
        <DropdownItem
          key="undo"
          disabled={ !field.hasChanged || field.isNew }
          onSelect={ () => dispatch(undoChanges(field.path)) }>
          Undo Changes
        </DropdownItem>
      </Dropdown.Menu>
    </StyledDropdown>
  </div>

export default FieldHeader
