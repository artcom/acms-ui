import startCase from "lodash/startCase"
import React from "react"

import Card from "react-bootstrap/Card"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import FormLabel from "react-bootstrap/FormLabel"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"

import { getLanguageName } from "../language"

import { startFieldLocalization } from "../actions/localization"
import { uploadFile } from "../actions/upload"
import { changeValue, undoChanges } from "../actions/value"

import editors from "../editors"

export default function Field(props) {
  const { style, content } = renderContent(props)

  return (
    <Card variant={ style } header={ renderHeader(props) }>
      { content }
    </Card>
  )
}

function renderHeader({ field, dispatch }) {
  return (
    <div>
      { startCase(field.name) }

      <Dropdown pullRight style={ { float: "right" } } id={ field.name }>
        <Dropdown.Toggle noCaret bsSize="xsmall" />
        <Dropdown.Menu>
          <DropdownItem
            key="undo"
            disabled={ !field.hasChanged }
            onSelect={ () => dispatch(undoChanges(field.path)) }>
            Undo Changes
          </DropdownItem>,
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

function renderContent({ config, dispatch, field, languages }) {
  const Editor = editors[field.type]

  if (!Editor) {
    return {
      style: "danger",
      content: <span>Unknown field type <code>{ field.type }</code></span>
    }
  }

  return {
    style: field.hasChanged ? "info" : "default",
    content: field.isLocalized
      ? renderLocalizedEditors(field, languages, config, dispatch, Editor)
      : renderEditor(field, config, dispatch, Editor)
  }
}

function renderLocalizedEditors(field, languages, config, dispatch, Editor) {
  const items = field.value.map((value, languageId) => {
    const languageField = { ...field,
      path: [...field.path, languageId],
      value: field.value.get(languageId)
    }

    return (
      <ListGroupItem key={ languageId }>
        <FormLabel>
          { getLanguageName(languageId, languages) }
        </FormLabel>

        { renderEditor(languageField, config, dispatch, Editor) }
      </ListGroupItem>
    )
  }).valueSeq()

  return <ListGroup fill>{ items }</ListGroup>
}

function renderEditor(field, config, dispatch, Editor) {
  return (
    <Editor
      config={ config }
      field={ field }
      onChange={ event => dispatch(changeValue(field.path, event.target.value)) }
      onFileSelect={ files => dispatch(uploadFile(field.path, files[0], config.assetServer)) } />
  )
}
