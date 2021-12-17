import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import Button from "react-bootstrap/Button"

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
import { fromPath } from "../../utils/hash"

import {
  getLanguages,
  selectTemplateChildren,
  selectAllowedFixedChildren,
  selectAllowedChildren,
  selectAllowedFields,
  getChildrenLabel,
  getFieldsLabel,
  selectTemplateId,
  getTextDirection,
  getPath,
  selectOriginalEntity
} from "../../selectors"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

const ArrowButton = styled(Button)`
  height: 3em;
  width: 3em;
  border-radius: 100px;
  background: #e9ecef;
  border: none;
  color: grey;
`

const ArrowIcon = styled.div`
  margin-top: -10px;
  font-size: 2.5em;
  line-height: 1em;
`

export default connect(mapStateToProps)(Body)

function mapStateToProps(state) {
  return {
    canHaveChildren: selectTemplateChildren(state).length > 0,
    templateId: selectTemplateId(state),
    children: selectAllowedChildren(state),
    fixedChildren: selectAllowedFixedChildren(state),
    fields: selectAllowedFields(state),
    languages: getLanguages(state),
    textDirection: getTextDirection(state),
    childrenLabel: getChildrenLabel(state),
    fieldsLabel: getFieldsLabel(state),
    path: getPath(state),
    originalEntity: selectOriginalEntity(state),
  }
}

function Body({
  canHaveChildren,
  children,
  templateId,
  fixedChildren,
  acmsAssets,
  dispatch,
  fields,
  languages,
  textDirection,
  childrenLabel,
  fieldsLabel,
  path,
  originalEntity }) {
  const parentPath = [...path]
  parentPath.pop()
  return (
    <div>
      <Row className="d-flex align-items-center justify-content-center">
        { console.log("canHaveChildren", canHaveChildren) }
        { console.log("children", children) }
        { console.log("templateId", templateId) }
        { console.log("fixedChildren", fixedChildren) }
        { console.log("acmsAssets", acmsAssets) }
        { console.log("dispatch", dispatch) }
        { console.log("fields", fields) }
        { console.log("languages", languages) }
        { console.log("textDirection", textDirection) }
        { console.log("childrenLabel", childrenLabel) }
        { console.log("fieldsLabel", fieldsLabel) }
        { console.log("path", path) }
        { console.log("originalEntity", originalEntity) }
        { console.log("parentPath", parentPath) }
        <Col md={ 3 }>
          {
            (fixedChildren.length + children.length > 0 || canHaveChildren)
          && <h4>{ childrenLabel }</h4>
          }
          { fixedChildren.length > 0 && renderFixedChildren(fixedChildren, dispatch) }
          { (children.length > 0 || canHaveChildren) &&
          renderChildren(children, dispatch, canHaveChildren) }
        </Col>

        <Col md={ 7 }>
          <div className="d-flex align-items-center">
            { fields.length > 0 && <h4 className="pr-2">{ fieldsLabel }</h4> }
            { templateId.split("/").length > 1 && fields.length > 0 &&
            <small className="text-muted" data-toggle="tooltip" title={ templateId }>
              { `(${templateId.split("/").at(-1)})` }
            </small> }
          </div>
          { renderFields(fields, languages, textDirection, acmsAssets, dispatch) }
        </Col>
      </Row>
      { children.length === 0 &&
      <Row>
        <Col className="d-flex justify-content-left" md={ 1 }>
          <ArrowButton
            data-toggle="tooltip"
            title="Previous Children"
            className="d-flex align-items-center justify-content-center"
            variant="secondary"
            href={ fromPath(path.slice(0, -1)) }
            disabled={ path.length === 0 }>
            <ArrowIcon>
              &#60;
            </ArrowIcon>
          </ArrowButton>
        </Col>
        <Col className="d-flex justify-content-right" md={ 6 }>
          <ArrowButton
            data-toggle="tooltip"
            title="Next Children"
            className="d-flex align-items-center justify-content-center"
            variant="secondary">
            <ArrowIcon>
              &#62;
            </ArrowIcon>
          </ArrowButton>
        </Col>
      </Row>
      }
    </div>
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

function renderFields(fields, languages, textDirection, acmsAssets, dispatch) {
  return fields.map(field =>
    <Field
      key={ field.id }
      field={ field }
      languages={ languages }
      textDirection={ textDirection }
      acmsAssets={ acmsAssets }
      dispatch={ dispatch } />
  )
}
