import startCase from "lodash/startCase"
import React from "react"

import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import styled from "styled-components"

import { undoChanges } from "../../../actions/value"

import ToggleButton from "../../toggleButton"
import CharacterCount from "./characterCount"
import ImageRequirements from "./imageRequirements"

const StyledDropdown = styled(Dropdown)`
  margin-left: 0.5rem;
`

const Flexbox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Fieldname = styled.div`
  margin-right: auto;
`

const FieldHeader = ({ field, dispatch }) =>
  <Flexbox>
    <Fieldname > { field.name ? field.name : startCase(field.id) } </Fieldname>
    { field.maxLength && !field.localization &&
    <CharacterCount value={ field.value } maxLength={ field.maxLength } /> }
    { field.type === "image" && <ImageRequirements field={ field } /> }
    { field.type === "number" && !field.integer && <p> Float </p> }
    { field.type === "number" && field.integer && <p> Integer </p> }
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
  </Flexbox>

export default FieldHeader
