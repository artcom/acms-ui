import React from "react"

import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import styled from "styled-components"

import { uploadFile } from "../../../actions/upload"
import { changeValue } from "../../../actions/value"

import editors from "./editors"

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 0px;
`

const StyledCardHeader = styled(Card.Header)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`

const FieldContent = ({ acmsAssets, dispatch, field, languages, textDirection }) => {
  const Editor = editors[field.type]

  if (!Editor) {
    return <span>Unknown field type <code>{ field.type }</code></span>
  }

  return field.localization
    ? renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor)
    : renderEditor(field, textDirection, acmsAssets, dispatch, Editor)
}

function renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor) {
  const items = field.localization.map(locale => {
    const languageField = {
      ...field,
      path: [...field.path, locale],
      value: field.value[locale]
    }

    const language = languages.find(({ id }) => id === locale) || { name: locale, textDirection }

    return (
      <StyledListGroupItem key={ locale }>
        <StyledCardHeader className="text-muted">
          { language.name }
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
