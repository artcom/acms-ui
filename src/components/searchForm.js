import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import { InputGroup, Form } from "react-bootstrap"

import { useSelector } from "react-redux"

import styled from "styled-components"
import { debounce } from "lodash"
import StyledFormControl from "./body/field/editors/styledFormControl"

import { searchData } from "../actions/data"
import SearchIcon from "./searchIcon"
import { getSearch } from "../selectors"

const ClearButton = styled(Button)`
  background-color: #fff;
  border: 0px;
`

const SearchButton = styled(Button)`
  padding: 10px 15px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const StyledForm = styled(Form)`
  display: flex;
  justify-content: center;
  margin-left: 1em;
`

const Search = ({ dispatch }) => {
  const search = useSelector(getSearch)
  const [show, setShow] = useState(false)
  const [value, setValue] = useState(search)

  const debouncedSearch = debounce(() => dispatch(searchData(value)), 300)

  useEffect(() => debouncedSearch(), [value])

  const handleOnChange = event => {
    setValue(event.target.value)
  }

  const resetValue = () => {
    setValue("")
  }

  const toggleShow = () => {
    if (show) {setShow(false)} else {setShow(true)}
  }

  return (
    <StyledForm>
      <InputGroup>
        { show &&
          <>
            <StyledFormControl
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={ value }
              onChange={ handleOnChange } />
            <ClearButton
              variant="light"
              title="Clear"
              onClick={ () => {
                resetValue()
                dispatch(searchData(""))
              } } >
              X
            </ClearButton>
          </>
        }
        <SearchButton
          variant="secondary"
          type="submit"
          title={ !show ? "Open Search" : "Close Search" }
          onClick={ () => toggleShow() }>
          <SearchIcon />
        </SearchButton>
      </InputGroup>
    </StyledForm>
  )
}


export default Search
