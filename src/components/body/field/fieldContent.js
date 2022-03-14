import React from "react"

import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import styled from "styled-components"

import { uploadFile } from "../../../actions/upload"
import { changeValue } from "../../../actions/value"

import editors from "./editors"
import StringRequirements from "./requirements/stringRequirements"

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 0px;
`

const StyledCardHeader = styled(Card.Header)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
`

const FieldContent = ({ acmsAssets, dispatch, field, languages, textDirection }) => {
  const Editor = editors[field.type]

  if (!Editor) {
    return <span>Unknown field type <code>{ field.type }</code></span>
  }

  if (field.geolocation) {
    return renderGeolocationEditors(field, textDirection, acmsAssets, dispatch, Editor)
  }

  return field.localization
    ? renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor)
    : renderEditor(field, textDirection, acmsAssets, dispatch, Editor)
}

function renderGeolocationEditors(field, textDirection, acmsAssets, dispatch, Editor) {
  const items = field.editors.map(id => {
    const locationField = {
      ...field,
      path: [...field.path, id],
      value: field.value[id]
    }

    return (
      <StyledListGroupItem key={ id }>
        <StyledCardHeader className="text-muted">
          { id === "lat" ? "Latitude" : "Longitude" }
        </StyledCardHeader>
        { renderEditor(locationField, textDirection, acmsAssets, dispatch, Editor) }
      </StyledListGroupItem>
    )
  })

  return <ListGroup variant="flush">{ items }</ListGroup>
}

function renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor) {
  const items = field.localization.map(id => {
    const languageField = {
      ...field,
      path: [...field.path, id],
      value: field.value[id]
    }
    const language = languages.find(lang => lang.id === id) || { name: id, textDirection }

    return (
      <StyledListGroupItem key={ id }>
        <StyledCardHeader className="text-muted">
          { language.name }
          { field.maxLength &&
          <StringRequirements
            field={ { value: languageField.value, maxLength: field.maxLength } } /> }
        </StyledCardHeader>
        { renderEditor(languageField, language.textDirection, acmsAssets, dispatch, Editor) }
      </StyledListGroupItem>
    )
  })

  return <ListGroup variant="flush">{ items }</ListGroup>
}

function renderEditor(field, textDirection, acmsAssets, dispatch, Editor) {
  return (
    <Editor
      field={ field }
      textDirection={ textDirection }
      onChange={ event => dispatch(changeValue(field.path, event.target.value)) }
      onFileSelect={ files => dispatch(uploadFile(field.path, files[0], acmsAssets)) } />
  )
}

export default FieldContent
