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

import { deleteEntity, startEntityCreation, startEntityRenaming } from "../actions/entity"
import { undoChanges } from "../actions/value"
import { fromPath } from "../hash"

import {
  getLanguages,
  getTemplateChildren,
  getWhitelistedFixedChildren,
  getWhitelistedChildren,
  getWhitelistedFields
} from "../selectors"

export default connect(mapStateToProps)(Entity)

function mapStateToProps(state) {
  return {
    canHaveChildren: getTemplateChildren(state).length > 0,
    children: getWhitelistedChildren(state),
    fixedChildren: getWhitelistedFixedChildren(state),
    fields: getWhitelistedFields(state),
    languages: getLanguages(state)
  }
}

function Entity({ canHaveChildren, children, fixedChildren, config, dispatch, fields, languages }) {
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
        { renderFields(fields, languages, config, dispatch) }
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
  const displayName = startCase(child.name)
  const link = child.isDeleted ? displayName : <a href={ fromPath(child.path) }>{ displayName }</a>

  return (
    <ListGroupItem key={ child.name } variant={ childStyle(child) }>
      { link }

      <Dropdown className="float-right btn-sm" id={ child.name }>
        <Dropdown.Toggle />
        <Dropdown.Menu>
          <DropDownItem
            disabled={ child.isDeleted }
            onSelect={ () => dispatch(startEntityRenaming(child.name)) }>
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

function renderFields(fields, languages, config, dispatch) {
  return fields.map(field =>
    <Field
      key={ field.id }
      field={ field }
      languages={ languages }
      config={ config }
      dispatch={ dispatch } />
  )
}
