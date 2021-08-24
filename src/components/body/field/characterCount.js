import React from "react"
import styled from "styled-components"

const Flexbox = styled.div`
    display: flex;
`

const FlexItem = styled.span`
    margin-left: 1.3rem;
`

const CharacterCount = ({ field }) => {
  const values = []

  if (field.isLocalized) {
    Object.values(field.value).forEach(value => values.push(value.length))
  } else {
    values.push(field.value.length)
  }

  if (field.isLocalized) {
    return (
      <Flexbox>
        { values.map((value, index) => <FlexItem key={ index } > { `${field.maxLength - value}  / ${field.maxLength}` } </FlexItem>) }
      </Flexbox>
    )
  }
  return <div> { `${field.maxLength - values[0]}  / ${field.maxLength}` } </div>
}
export default CharacterCount
