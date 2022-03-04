import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropDownItem from "react-bootstrap/DropdownItem"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import { Button } from "react-bootstrap"

import ChildItem from "./childItem"
import Field from "./field"

import { deleteEntity, startEntityCreation, startEntityRenaming } from "../../actions/entity"
import { undoChanges } from "../../actions/value"

import { fromPath } from "../../utils/hash"

import {
  getLanguages,
  selectTemplate,
  selectAllSiblingTemplates,
  selectTemplateChildren,
  selectAllowedFixedChildren,
  selectAllowedChildren,
  selectAllowedFields,
  getChildrenLabel,
  getFieldsLabel,
  getTextDirection,
  getNeighbourSiblings,
  getPath
} from "../../selectors"

import { ApiContext } from "../../index"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

const ArrowButton = styled(Button)`
  width: auto;
  height: auto;  
  border-radius: 50%;
  border: none;
`

const ArrowIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`


const Body = () => {
  const dispatch = useDispatch()
  const template = useSelector(selectTemplate)
  const allSiblingTemplates = useSelector(selectAllSiblingTemplates)
  const canHaveChildren = useSelector(selectTemplateChildren).length > 0
  const children = useSelector(selectAllowedChildren)
  const fixedChildren = useSelector(selectAllowedFixedChildren)
  const fields = useSelector(selectAllowedFields)
  const languages = useSelector(getLanguages)
  const textDirection = useSelector(getTextDirection)
  const childrenLabel = useSelector(getChildrenLabel)
  const fieldsLabel = useSelector(getFieldsLabel)
  const [leftSibling, rightSibling] = useSelector(getNeighbourSiblings)
  const path = useSelector(getPath)

  const acmsAssets = useContext(ApiContext).acmsAssets

  return (
    <div>
      <Row className="d-flex justify-content-center">
        { console.log("template", template) }
        { console.log("childrenTemplates", allSiblingTemplates) }
        { console.log("canHaveChildren", canHaveChildren) }
        { console.log("children", children) }
        { console.log("fixedChildren", fixedChildren) }
        { console.log("acmsAssets", acmsAssets) }
        { console.log("dispatch", dispatch) }
        { console.log("fields", fields) }
        { console.log("languages", languages) }
        { console.log("textDirection", textDirection) }
        { console.log("childrenLabel", childrenLabel) }
        { console.log("fieldsLabel", fieldsLabel) }
        { console.log("leftSibling", leftSibling) }
        { console.log("rightSibling", rightSibling) }
        { console.log("path", path) }
        <Col md={ 1 }>
          { leftSibling &&
          <ArrowButton
            variant="light"
            title={ leftSibling.name }
            href={ fromPath(leftSibling.path) }>
            <ArrowIcon>
              &#60;
            </ArrowIcon>
          </ArrowButton>
          }
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
          { fields.length > 0 && <h4 className="pr-2">{ fieldsLabel }</h4> }
          { renderFields(fields, languages, textDirection, acmsAssets, dispatch) }
        </Col>
        <Col md={ 1 }>
          { rightSibling &&
          <ArrowButton
            style={ { float: "right" } }
            variant="light"
            title={ rightSibling.name }
            href={ fromPath(rightSibling.path) }>
            <ArrowIcon>
              &#62;
            </ArrowIcon>
          </ArrowButton>
          }
        </Col>
      </Row>
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

export default Body
