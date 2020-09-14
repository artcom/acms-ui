import React from "react"

import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import styled from "styled-components"

import { getLanguageName } from "../../utils/language"

import { uploadFile } from "../../actions/upload"
import { changeValue } from "../../actions/value"

import editors from "./../editors"

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 0px;
`

const StyledCardHeader = styled(Card.Header)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`

const FieldContent = ({ assetServer, dispatch, field, languages }) => {
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
      <StyledListGroupItem key={ languageId }>
        <StyledCardHeader className="text-muted">
          { getLanguageName(languageId, languages) }
        </StyledCardHeader>

        { renderEditor(languageField, assetServer, dispatch, Editor) }
      </StyledListGroupItem>
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

export default FieldContent
