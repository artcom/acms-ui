import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import { Form, FormControl } from "react-bootstrap"

import { searchData } from "../actions/data"

const Search = ({ dispatch, acmsApi, acmsConfigPath }) => {
  const [value, setValue] = useState("")

  const handleOnChange = event => {
    setValue(event.target.value)
  }

  return (
    <Form className="d-flex justify-content-center align-items-center">
      <FormControl
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={ value }
        onChange={ handleOnChange } />
      <Button
        variant="secondary"
        onClick={ () => dispatch(searchData(acmsApi, acmsConfigPath, value)) }>
        &#xF52A;
      </Button>
    </Form>
  )
}


export default Search
