import React from "react"
import styled from "styled-components"

const MutedText = styled.div`
  color: #6c757d;
`

const CharacterCount = ({ field, languageId }) => {
  console.log("field: ", field)
  console.log("field.value @ language id: ", field.value[languageId])
  
  if (field.hasOwnProperty("localization")) {
    return (
      <MutedText> { `${field.maxLength - field.value[languageId].length}  / ${field.maxLength}` } </MutedText>
    )
  }
  return <MutedText> { `${field.maxLength - field.value.length}  / ${field.maxLength}` } </MutedText>
}

export default CharacterCount
