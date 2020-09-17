import React from "react"
import Alert from "react-bootstrap/Alert"

import { hideError } from "../actions/error"

const Error = ({ dispatch, flash }) =>
  <Alert variant="danger" onClose={ () => dispatch(hideError()) }>
    <h4>{ flash.title }</h4>
    <pre>
      <code>
        { JSON.stringify(flash.error.response, null, 2) || flash.error.stack }
      </code>
    </pre>
  </Alert>

export default Error
