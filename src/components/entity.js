import startCase from "lodash/startCase"
import React from "react"
import { connect } from "react-redux"

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

const ITEM_STYLE = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "60px"
}

const ITEM_TEXT_STYLE = {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  minWidth: "0"
}

const SUBTITLE_STYLE = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflowX: "hidden"
}

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
    <ListGroupItem
      key={ child.id }
      variant={ childStyle(child) }
      style={ ITEM_STYLE }>
      <div style={ ITEM_TEXT_STYLE }>
        { link }
        <Form.Text style={ SUBTITLE_STYLE } muted>{ child.subtitle }</Form.Text>
      </div>
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
    </ListGroupItem>
  )
}

function renderChildren(children, dispatch, canHaveChildren) {
  return (
    <ListGroup className="mb-3">
      { children.map(child => renderChild(child, dispatch)) }
      { canHaveChildren &&
        <ListGroupItem
          variant="secondary"
          style={ { padding: "0px", textAlign: "center", outline: "none" } }
          action
          onClick={ () => dispatch(startEntityCreation()) }>+
        </ListGroupItem>
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
    <ListGroupItem
      key={ child.id }
      variant={ childStyle(child) }
      style={ ITEM_STYLE }>
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
    </ListGroupItem>
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
