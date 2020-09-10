import startCase from "lodash/startCase"
import React from "react"

import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"

import { startFieldLocalization } from "../actions/localization"
import { undoChanges } from "../actions/value"

import ToggleButton from "./toggleButton"


const FieldHeader = ({ field, dispatch }) =>
  <div>
    { field.name ? field.name : startCase(field.id) }

    <Dropdown style={ { float: "right" } } id={ field.id }>
      <Dropdown.Toggle as={ ToggleButton } />
      <Dropdown.Menu>
        <DropdownItem
          key="undo"
          disabled={ !field.hasChanged || field.isNew }
          onSelect={ () => dispatch(undoChanges(field.path)) }>
          Undo Changes
        </DropdownItem>
        <DropdownItem
          key="localize"
          onSelect={ () => dispatch(startFieldLocalization(field)) }>
          Localize...
        </DropdownItem>
      </Dropdown.Menu>
    </Dropdown>
  </div>

export default FieldHeader
