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
  getPath
} from "../../selectors"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

const RightArrowButton = styled(Button)`
  height: 3em;
  width: 3em;
  border-radius: 100px;
  background: #e9ecef;
  border: none;
  color: grey;
`

const LeftArrowButton = styled(Button)`
  height: 3em;
  width: 3em;
  border-radius: 50px;
  background: #e9ecef;
  border: none;
  color: grey;
`

const RightArrowIcon = styled.div`
  margin-top: -10px;
  font-size: 2.5em;
  line-height: 1em;
`

const LeftArrowIcon = styled.div`
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
    path: getPath(state)
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
  path }) {
  return (
    <Row>
      { console.log("path", path) }
      { console.log("children", children) }
      <Col md={ 1 }>
        <LeftArrowButton
          className="d-flex align-items-center"
          variant="secondary"
          href={ fromPath([]) }
          disabled={ path.length === 0 }>
          <LeftArrowIcon>
            &#60;
          </LeftArrowIcon>
        </LeftArrowButton>
      </Col>
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
      <Col md={ 1 }>
        <RightArrowButton
          className="d-flex align-items-center"
          variant="secondary">
          <RightArrowIcon>
            &#62;
          </RightArrowIcon>
        </RightArrowButton>
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
