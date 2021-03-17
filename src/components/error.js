import React from "react"
import Alert from "react-bootstrap/Alert"

import { hideError } from "../actions/error"

const Error = ({ dispatch, flash }) =>
  <Alert variant="danger" onClose={ () => dispatch(hideError()) } dismissible>
    <h4>{ flash.title }</h4>
    <pre>
      <code>
        { flash.details.stack ? flash.details.stack : flash.details.message }
      </code>
    </pre>
  </Alert>

export default Error
