import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import styled from "styled-components"

import { uploadFile } from "../../../actions/upload"
import { setValue } from "../../../actions/value"

import editors from "./editors"
import StringRequirements from "./requirements/stringRequirements"
import PreviewButton from "./previewButton"

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 0px;
`

const StyledCardHeader = styled(Card.Header)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
`
const StyledErrorField = styled.div`
  padding: 10px 20px;
  color: red;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const EditorContainer = styled.div`
  flex-grow: 1;
`

const FieldContent = ({ acmsAssets, dispatch, field, languages, textDirection }) => {
  const Editor = editors[field.type]

  if (!Editor) {
    return <StyledErrorField>Unknown field type &apos;{field.type}&apos;</StyledErrorField>
  }

  return field.localization
    ? renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor)
    : renderEditor(field, textDirection, acmsAssets, dispatch, Editor)
}

function renderLocalizedEditors(field, languages, textDirection, acmsAssets, dispatch, Editor) {
  const items = field.localization.map((id) => {
    const languageField = {
      ...field,
      path: [...field.path, id],
      value: field.value[id],
    }
    const language = languages.find((lang) => lang.id === id) || { name: id, textDirection }

    return (
      <StyledListGroupItem key={id}>
        <StyledCardHeader className="text-muted">
          {language.name}
          {field.maxLength && (
            <StringRequirements
              field={{ value: languageField.value, maxLength: field.maxLength }}
            />
          )}
        </StyledCardHeader>
        {renderEditor(languageField, language.textDirection, acmsAssets, dispatch, Editor)}
      </StyledListGroupItem>
    )
  })

  return <ListGroup variant="flush">{items}</ListGroup>
}

function renderEditor(field, textDirection, acmsAssets, dispatch, Editor) {
  return (
    <ContentContainer>
      <EditorContainer>
        <Editor
          field={field}
          textDirection={textDirection}
          onChange={(newValue) => dispatch(setValue(field.path, newValue))}
          onFileSelect={(files) => dispatch(uploadFile(field.path, files[0], acmsAssets))}
        />
      </EditorContainer>
      {field.preview && <PreviewButton preview={field.preview} value={field.value} />}
    </ContentContainer>
  )
}

export default FieldContent
