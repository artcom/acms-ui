import startCase from "lodash/startCase"
import React from "react"

import Card from "react-bootstrap/Card"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import ListGroup from "react-bootstrap/ListGroup"

import { Button } from "react-bootstrap"
import { getLanguageName } from "../language"

import { startFieldLocalization } from "../actions/localization"
import { uploadFile } from "../actions/upload"
import { changeValue, undoChanges } from "../actions/value"

import editors from "../editors"

export default function Field(props) {
  const { style, content } = renderContent(props)

  return (
    <Card border={ style } className="mb-3">
      <Card.Header>{ renderHeader(props) }</Card.Header>
      { content }
    </Card>
  )
}

function renderHeader({ field, dispatch }) {
  return (
    <div>
      { startCase(field.id ? field.id : field.id) }

      <Dropdown style={ { float: "right" } } id={ field.id }>
        <Dropdown.Toggle as={ CustomToggle } />
        <Dropdown.Menu>
          <DropdownItem
            key="undo"
            disabled={ !field.hasChanged }
            onSelect={ () => dispatch(undoChanges(field.path)) }>
            Undo Changes
          </DropdownItem>
          <DropdownItem
            key="localize"
            onSelect={ () => dispatch(startFieldLocalization(field)) }>
            Localize...
          </DropdownItem>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

function renderContent({ assetServer, dispatch, field, languages }) {
  const Editor = editors[field.type]

  if (!Editor) {
    return {
      style: "danger",
      content: <span>Unknown field type <code>{ field.type }</code></span>
    }
  }

  return {
    style: field.hasChanged ? "warning" : "secondary",
    content: field.isLocalized
      ? renderLocalizedEditors(field, languages, assetServer, dispatch, Editor)
      : renderEditor(field, assetServer, dispatch, Editor)
  }
}

function renderLocalizedEditors(field, languages, assetServer, dispatch, Editor) {
  const items = Object.keys(field.value).map(languageId => {
    const languageField = { ...field,
      path: [...field.path, languageId],
      value: field.value[languageId]
    }

    return (
      <ListGroup.Item key={ languageId } style={ { padding: "0px" } }>
        <Card.Header className="text-muted"
          style={ { paddingTop: "0.3rem", paddingBottom: "0.3rem" } }>
          { getLanguageName(languageId, languages) }
        </Card.Header>

        { renderEditor(languageField, assetServer, dispatch, Editor) }
      </ListGroup.Item>
    )
  })

  return <ListGroup variant="flush">{ items }</ListGroup>
}

function renderEditor(field, assetServer, dispatch, Editor) {
  return (
    <Editor
      field={ field }
      onChange={ event => dispatch(changeValue(field.path, event.target.value)) }
      onFileSelect={ files => dispatch(uploadFile(field.path, files[0], assetServer)) } />
  )
}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) =>
  <Button
    variant="outline-secondary"
    style={ { padding: "0px 5px" } }
    href=""
    ref={ ref }
    onClick={ e => {
      e.preventDefault()
      onClick(e)
    } }>
    { children }
    &#9776;
  </Button>
)
