import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropDownItem from "react-bootstrap/DropdownItem"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import { Button, Container } from "react-bootstrap"

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
  getTextDirection,
  getNeighbourSiblings
} from "../../selectors"

import { ApiContext } from "../../index"

const AddButton = styled(ListGroupItem)`
  padding: 0px;
  text-align: center; 
  outline: none;
`

const ArrowButton = styled(Button).attrs(() => ({
  variant: "light"
}))`
  text-align: center; 
  outline: none; 
  position: sticky;
  top: 50%;
`

const LeftArrowCol = styled(Col).attrs(() => ({
  xs: 2,
  md: 1
}))`
  display: flex;
  height: 100vh;
  align-items: start;
  padding: 0;
`

const RightArrowCol = styled(LeftArrowCol)`
  justify-content: end;
`

const ContentContainer = styled(Row)`
  display: flex;
  justify-content: start;
`

const ChildrenCol = styled(Col).attrs(() => ({
  xs: 12,
  md: 4
}))``


const Body = () => {
  const dispatch = useDispatch()
  const canHaveChildren = useSelector(selectTemplateChildren).length > 0
  const children = useSelector(selectAllowedChildren)
  const fixedChildren = useSelector(selectAllowedFixedChildren)
  const fields = useSelector(selectAllowedFields)
  const languages = useSelector(getLanguages)
  const textDirection = useSelector(getTextDirection)
  const childrenLabel = useSelector(getChildrenLabel)
  const fieldsLabel = useSelector(getFieldsLabel)
  const [leftSibling, rightSibling] = useSelector(getNeighbourSiblings)

  const acmsAssets = useContext(ApiContext).acmsAssets

  return (
<<<<<<< HEAD
    <div>
      <Row className="d-flex justify-content-center">
        <Col md={ 1 }>
=======
    <Container fluid>
      <Row>
        <LeftArrowCol>
>>>>>>> master
          { leftSibling &&
          <ArrowButton
            title={ leftSibling.name }
            href={ fromPath(leftSibling.path) }>
            &#8592;
          </ArrowButton>
          }
        </LeftArrowCol>
        <Col>
          <ContentContainer>
            <ChildrenCol>
              {
                (fixedChildren.length + children.length > 0 || canHaveChildren) &&
                <h4>{ childrenLabel }</h4>
              }
              { fixedChildren.length > 0 && renderFixedChildren(fixedChildren, dispatch) }
              {
                (children.length > 0 || canHaveChildren) &&
              renderChildren(children, dispatch, canHaveChildren)
              }
            </ChildrenCol>
            <Col>
              { fields.length > 0 && <h4 className="pr-2">{ fieldsLabel }</h4> }
              { renderFields(fields, languages, textDirection, acmsAssets, dispatch) }
            </Col>
          </ContentContainer>
        </Col>
        <RightArrowCol>
          { rightSibling &&
          <ArrowButton
            title={ rightSibling.name }
            href={ fromPath(rightSibling.path) }>
            &#8594;
          </ArrowButton>
          }
        </RightArrowCol>
      </Row>
    </Container>
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
