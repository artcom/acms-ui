import { useEffect, useState, useCallback, useRef } from "react"
import Button from "react-bootstrap/Button"
import { InputGroup, Form } from "react-bootstrap"

import { useDispatch, useSelector } from "react-redux"

import styled from "styled-components"
import { debounce } from "lodash"
import { StyledFormControl } from "./body/field/editors/styledForms"

import { searchData } from "../actions/data"
import { getSearch } from "../selectors"

import { Search, XLg } from "react-bootstrap-icons"

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

const SearchForm = () => {
  const dispatch = useDispatch()
  const inputField = useRef()
  const search = useSelector(getSearch)
  const [show, setShow] = useState(false)
  const [value, setValue] = useState(search)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((v) => {
      dispatch(searchData(v))
    }, 300),
    []
  )

  useEffect(() => debouncedSearch(value), [debouncedSearch, value])

  useEffect(() => {
    show && inputField.current.focus()
  }, [show, inputField])

  useEffect(() => {
    if (!show && value !== "") {
      setValue("")
      dispatch(searchData(""))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, show])

  const handleOnChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <StyledForm>
      <InputGroup>
        {show && (
          <StyledFormControl
            ref={inputField}
            type="search"
            placeholder="Search..."
            aria-label="Search"
            value={value}
            onChange={handleOnChange}
          />
        )}
        <SearchButton
          variant="secondary"
          type="submit"
          title={!show ? "Open Search" : "Close Search"}
          onClick={() => setShow(!show)}
        >
          {show ? <XLg size={20} /> : <Search size={20} />}
        </SearchButton>
      </InputGroup>
    </StyledForm>
  )
}

export default SearchForm
