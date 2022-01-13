import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  getFieldsLabel,
  selectTemplateId,
  getTextDirection
} from "../../selectors"

import { ApiContext } from "../../index"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
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

  const acmsAssets = useContext(ApiContext).acmsAssets

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
