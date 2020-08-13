import startCase from "lodash/startCase"
import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropDownItem from "react-bootstrap/DropDownItem"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"

import Field from "./field"

import ToggleButton from "../components/toggleButton"

import { deleteEntity, startEntityCreation, startEntityRenaming } from "../actions/entity"
import { undoChanges } from "../actions/value"
import { fromPath } from "../hash"

import {
  getLanguages,
  selectTemplateChildren,
  selectWhitelistedFixedChildren,
  selectWhitelistedChildren,
  selectWhitelistedFields
} from "../selectors"

export default connect(mapStateToProps)(Entity)

function mapStateToProps(state) {
  return {
    canHaveChildren: selectTemplateChildren(state).length > 0,
    children: selectWhitelistedChildren(state),
    fixedChildren: selectWhitelistedFixedChildren(state),
    fields: selectWhitelistedFields(state),
    languages: getLanguages(state)
  }
}

function Entity({
  canHaveChildren,
  children,
  fixedChildren,
  assetServer,
  dispatch,
  fields,
  languages }) {
  return (
    <Row>
      <Col md={ 4 }>
        <h4>Children</h4>
        { renderFixedChildren(fixedChildren, dispatch) }
        { renderChildren(children, dispatch) }
        { canHaveChildren && <Button onClick={ () => dispatch(startEntityCreation()) } /> }
      </Col>

      <Col md={ 8 }>
        <h4>Fields</h4>
        { renderFields(fields, languages, assetServer, dispatch) }
      </Col>
    </Row>
  )
}

function renderFixedChildren(children, dispatch) {
  return (
    <ListGroup>
      { children.map(child => renderChild(child, dispatch)) }
    </ListGroup>
  )
}

function renderChildren(children, dispatch) {
  return (
    <ListGroup>
      { children.map(child => renderChild(child, dispatch)) }
    </ListGroup>
  )
}

function renderChild(child, dispatch) {
  const displayName = startCase(child.id)
  const link = child.isDeleted ? displayName : <a href={ fromPath(child.path) }>{ displayName }</a>

  return (
    <ListGroupItem
      key={ child.id }
      variant={ childStyle(child) }
      style={ { display: "flex", justifyContent: "space-between", alignItems: "center" } }>
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
            disabled={ !child.hasChanged }
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
