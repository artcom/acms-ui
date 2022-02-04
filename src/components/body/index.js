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
  selectTemplateChildren,
  selectAllowedFixedChildren,
  selectAllowedChildren,
  selectAllowedFields,
  getChildrenLabel,
  getFieldsLabel,
  selectTemplateId,
  getTextDirection,
  getSiblingsPath,
  getPath
} from "../../selectors"

import { ApiContext } from "../../index"

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


const Body = () => {
  const dispatch = useDispatch()
  const canHaveChildren = useSelector(selectTemplateChildren).length > 0
  const templateId = useSelector(selectTemplateId)
  const children = useSelector(selectAllowedChildren)
  const fixedChildren = useSelector(selectAllowedFixedChildren)
  const fields = useSelector(selectAllowedFields)
  const languages = useSelector(getLanguages)
  const textDirection = useSelector(getTextDirection)
  const childrenLabel = useSelector(getChildrenLabel)
  const fieldsLabel = useSelector(getFieldsLabel)
  const siblingsPath = useSelector(getSiblingsPath)
  console.log(siblingsPath)
  const path = useSelector(getPath)
  console.log(path)
  const index = getIndex(siblingsPath, path)
  console.log(index)

  const acmsAssets = useContext(ApiContext).acmsAssets

  return (
    <div>
      { siblingsPath.length !== 0 &&
      <Row>
        <ArrowButton
          variant="secondary"
          disabled={ index === 0 || index === -1 }
          title={ index !== 0 ? siblingsPath[index - 1][0] : "No more siblings" }
          href={ index === 0 ? fromPath(siblingsPath[index]) :
            fromPath(siblingsPath[index - 1]) }>
          <ArrowIcon>
            &#60;
          </ArrowIcon>
        </ArrowButton>
      </Row>
      }
      <Row className="d-flex justify-content-center">
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
        { console.log("siblingsPath", siblingsPath) }
        { console.log("path", path) }
        { console.log("index", index) }
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
      { siblingsPath.length !== 0 &&
      <Row>
        <ArrowButton
          variant="secondary"
          disabled={ index === siblingsPath.length - 1 || index === -1 }
          title={ index !== siblingsPath.length - 1 ? siblingsPath[index + 1][0] :
            "No more siblings" }
          href={ index === siblingsPath.length - 1 ? fromPath(siblingsPath[index]) :
            fromPath(siblingsPath[index - 1]) }>
          <ArrowIcon>
            &#62;
          </ArrowIcon>
        </ArrowButton>
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

function getIndex(siblingsPath, path) {
  for (let i = 0; i < siblingsPath.length; i++) {
    for (let k = 0; k < siblingsPath[i].length; k++) {
      if (siblingsPath[i][k] === path[k]) {return i}
    }
  }
  return -1
}

export default Body
