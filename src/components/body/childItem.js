import Dropdown from "react-bootstrap/Dropdown"
import Form from "react-bootstrap/Form"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import React from "react"
import styled from "styled-components"

import ToggleButton from "../toggleButton"
import { fromPath } from "../../utils/hash"

const StyledListGroupItem = styled(ListGroupItem)`
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

export default ({ child, children }) => {
  const link = child.isDeleted ?
    child.name :
    <a
      href={ fromPath(child.path) }
      className={ child.isEnabled ? "" : "text-muted" }>
      { child.name }
    </a>

  return (
    <StyledListGroupItem
      key={ child.id }
      variant={ childStyle(child) }>
      <ItemText>
        { link }
        <Subtitle muted>{ child.subtitle }</Subtitle>
      </ItemText>
      <Dropdown className="float-right btn-sm" id={ child.id } drop="right">
        <Dropdown.Toggle as={ ToggleButton } />
        { children }
      </Dropdown>
    </StyledListGroupItem>
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
