import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropDownItem from "react-bootstrap/DropdownItem"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"

import ChildItem from "./childItem"
import Field from "./field"

import { deleteEntity, startEntityCreation, startEntityRenaming } from "../../actions/entity"
import { undoChanges } from "../../actions/value"

import {
  getLanguages,
  selectTemplateChildren,
  selectAllowedFixedChildren,
  selectAllowedChildren,
  selectAllowedFields,
  getChildrenLabel,
  getFieldsLabel
} from "../../selectors"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

export default connect(mapStateToProps)(Body)

function mapStateToProps(state) {
  return {
    canHaveChildren: selectTemplateChildren(state).length > 0,
    children: selectAllowedChildren(state),
    fixedChildren: selectAllowedFixedChildren(state),
    fields: selectAllowedFields(state),
    languages: getLanguages(state),
    childrenLabel: getChildrenLabel(state),
    fieldsLabel: getFieldsLabel(state)
  }
}

function Body({
  canHaveChildren,
  children,
  fixedChildren,
  assetServer,
  dispatch,
  fields,
  languages,
  childrenLabel,
  fieldsLabel }) {
  return (
    <Row>
      <Col md={ 4 }>
        {
          (fixedChildren.length + children.length > 0 || canHaveChildren)
          && <h4>{ childrenLabel }</h4>
        }
        { fixedChildren.length > 0 && renderFixedChildren(fixedChildren, dispatch) }
        { (children.length > 0 || canHaveChildren) &&
          renderChildren(children, dispatch, canHaveChildren) }
      </Col>

      <Col md={ 8 }>
        { fields.length > 0 && <h4>{ fieldsLabel }</h4> }
        { renderFields(fields, languages, assetServer, dispatch) }
      </Col>
    </Row>
  )
}

function renderFixedChildren(children, dispatch) {
  return (
    <ListGroup className="mb-3">
      { children.map(child =>
        <ChildItem key={ child.id } child={ child } dispatch={ dispatch }>
          <Dropdown.Menu>
            <DropDownItem
              disabled={ !child.hasChanged }
              onSelect={ () => dispatch(undoChanges(child.path)) }>
              Undo Changes
            </DropDownItem>
          </Dropdown.Menu>
        </ChildItem>
      ) }
    </ListGroup>
  )
}

function renderChildren(children, dispatch, canHaveChildren) {
  return (
    <ListGroup className="mb-3">
      { children.map(child =>
        <ChildItem key={ child.id } child={ child } dispatch={ dispatch }>
          <Dropdown.Menu>
            <DropDownItem
              disabled={ child.isDeleted }
              onSelect={ () => dispatch(startEntityRenaming(child.id)) }>
              Rename...
            </DropDownItem>
            <DropDownItem
              disabled={ !child.hasChanged || child.isNew }
              onSelect={ () => dispatch(undoChanges(child.path)) }>
              Undo Changes
            </DropDownItem>
            <DropDownItem
              disabled={ child.isDeleted }
              onSelect={ () => dispatch(deleteEntity(child.path)) }>
              Delete
            </DropDownItem>
          </Dropdown.Menu>
        </ChildItem>
      ) }
      { canHaveChildren &&
        <AddButton
          variant="secondary"
          action
          onClick={ () => dispatch(startEntityCreation()) }>+
        </AddButton>
      }
    </ListGroup>
  )
}

function renderFields(fields, languages, assetServer, dispatch) {
  return fields.map(field =>
    <Field
      key={ field.id }
      field={ field }
      languages={ languages }
      assetServer={ assetServer }
      dispatch={ dispatch } />
  )
}
