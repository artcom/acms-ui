import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import { InputGroup } from "react-bootstrap"

import StyledFormControl from "./body/field/editors/styledFormControl"

import { searchData } from "../actions/data"
import SearchIcon from "./searchIcon"

const Search = ({ dispatch, acmsApi, acmsConfigPath }) => {
  const [value, setValue] = useState("")

  const handleOnChange = event => {
    setValue(event.target.value)
  }

  return (
    <InputGroup>
      <StyledFormControl
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={ value }
        onChange={ handleOnChange } />
      <Button
        variant="secondary"
        onClick={ () => dispatch(searchData(acmsApi, acmsConfigPath, value)) }>
        <SearchIcon />
      </Button>
    </InputGroup>
  )
}


export default Search
