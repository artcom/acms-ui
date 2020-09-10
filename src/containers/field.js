import startCase from "lodash/startCase"
import React from "react"

import Card from "react-bootstrap/Card"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import ListGroup from "react-bootstrap/ListGroup"
import Table from "react-bootstrap/Table"

import { getLanguageName } from "../language"

import { startFieldLocalization } from "../actions/localization"
import { uploadFile } from "../actions/upload"
import { changeValue, undoChanges } from "../actions/value"

import ToggleButton from "../components/toggleButton"

import editors from "../editors"

export default function Field(props) {
  const style = fieldStyle(props.field)

  return (
    <Card border={ style } className="mb-3">
      <Card.Header className={ style ? `list-group-item-${style}` : "" }>
        { renderHeader(props) }
      </Card.Header>
      { renderContent(props) }
    </Card>
  )
}

function renderHeader({ field, dispatch }) {
  return (
    <div>
      { field.name ? field.name : startCase(field.id) }

      <Dropdown style={ { float: "right" } } id={ field.id }>
        <Dropdown.Toggle as={ ToggleButton } />
        <Dropdown.Menu>
          <DropdownItem
            key="undo"
            disabled={ !field.hasChanged || field.isNew }
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
    return <span>Unknown field type <code>{ field.type }</code></span>
  }

  return field.isLocalized
    ? renderLocalizedEditors(field, languages, assetServer, dispatch, Editor)
    : renderEditor(field, assetServer, dispatch, Editor)
}

function renderLocalizedEditors(field, languages, assetServer, dispatch, Editor) {
  const items = Object.keys(field.value).map(languageId => {
    const languageField = { ...field,
      path: [...field.path, languageId],
      value: field.value[languageId]
    }

    return (
      <tr key={ languageId } >
        <td style={ { background: "rgba(0,0,0,.03)", borderRight: "1px solid rgba(0,0,0,.1)", width: 20, paddingTop: 20 } }>{ languageId }</td>
        <td>{ renderEditor(languageField, assetServer, dispatch, Editor) }</td>
      </tr>
    )
  })

  return (
    <Table style={ { margin: "0px", border: "0px solid green" } }>
      <tbody>
        { items }
      </tbody>
    </Table>
  )
}

function renderEditor(field, assetServer, dispatch, Editor) {
  return (
    <Editor
      field={ field }
      onChange={ event => dispatch(changeValue(field.path, event.target.value)) }
      onFileSelect={ files => dispatch(uploadFile(field.path, files[0], assetServer)) } />
  )
}

function fieldStyle({ hasChanged, isNew, type }) {
  if (isNew) {
    return "success"
  }

  if (!editors[type]) {
    return "danger"
  }

  if (hasChanged) {
    return "warning"
  }
}
