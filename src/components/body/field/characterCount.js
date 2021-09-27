import React from "react"
import styled from "styled-components"

const MutedText = styled.div`
  color: #6c757d;
`

const CharacterCount = ({ field, languageId }) => {
  if (field.isLocalized) {
    return (
      <MutedText> { `${field.maxLength - field.value[languageId].length}  / ${field.maxLength}` } </MutedText>
    )
  }
  return <MutedText> { `${field.maxLength - field.value.length}  / ${field.maxLength}` } </MutedText>
}

export default CharacterCount
