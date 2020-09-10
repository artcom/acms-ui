import startCase from "lodash/startCase"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropDownItem from "react-bootstrap/DropdownItem"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"

import Field from "./field"

import ToggleButton from "../components/toggleButton"

import { deleteEntity, startEntityCreation, startEntityRenaming } from "../actions/entity"
import { undoChanges } from "../actions/value"
import { fromPath } from "../utils/hash"

import {
  getLanguages,
  selectTemplateChildren,
  selectWhitelistedFixedChildren,
  selectWhitelistedChildren,
  selectWhitelistedFields,
  getChildrenLabel,
  getFieldsLabel
} from "../selectors"

const Child = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
`

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
`

const Subtitle = styled(Form.Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
`

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

export default connect(mapStateToProps)(Entity)

function mapStateToProps(state) {
  return {
    canHaveChildren: selectTemplateChildren(state).length > 0,
    children: selectWhitelistedChildren(state),
    fixedChildren: selectWhitelistedFixedChildren(state),
    fields: selectWhitelistedFields(state),
    languages: getLanguages(state),
    childrenLabel: getChildrenLabel(state),
    fieldsLabel: getFieldsLabel(state)
  }
}

function Entity({
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
        { renderChildren(children, dispatch, canHaveChildren) }
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
      { children.map(child => renderFixedChild(child, dispatch)) }
    </ListGroup>
  )
}

function renderFixedChild(child, dispatch) {
  const displayName = child.name ? child.name : startCase(child.id)
  const link = child.isDeleted ?
    displayName :
    <a
      href={ fromPath(child.path) }
      className={ child.isActive ? "" : "text-muted" }>
      { displayName }
    </a>

  return (
    <Child
      key={ child.id }
      variant={ childStyle(child) }>
      <ItemText>
        { link }
        <Subtitle muted>{ child.subtitle }</Subtitle>
      </ItemText>
      <Dropdown className="float-right btn-sm" id={ child.id } drop="right">
        <Dropdown.Toggle as={ ToggleButton } />
        <Dropdown.Menu>
          <DropDownItem
            disabled={ !child.hasChanged }
            onSelect={ () => dispatch(undoChanges(child.path)) }>
            Undo Changes
          </DropDownItem>
        </Dropdown.Menu>
      </Dropdown>
    </Child>
  )
}

function renderChildren(children, dispatch, canHaveChildren) {
  return (
    <ListGroup className="mb-3">
      { children.map(child => renderChild(child, dispatch)) }
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

function renderChild(child, dispatch) {
  const displayName = startCase(child.id)
  const link = child.isDeleted ?
    displayName :
    <a href={ fromPath(child.path) } >
      { displayName }
    </a>

  return (
    <Child
      key={ child.id }
      variant={ childStyle(child) }>
      { link }

      <Dropdown className="float-right btn-sm" id={ child.id } drop="right">
        <Dropdown.Toggle as={ ToggleButton } />
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
      </Dropdown>
    </Child>
  )
}

function childStyle(child) {
  if (child.isNew) {
    return "success"
  }

  if (child.isDeleted) {
    return "danger"
  }

  if (child.hasChanged) {
    return "warning"
  }

  return ""
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
