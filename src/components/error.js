import { useSelector, useDispatch } from "react-redux"
import Alert from "react-bootstrap/Alert"

import { hideError } from "../actions/error"

const Error = () => {
  const dispatch = useDispatch()
  const flash = useSelector(state => state.flash)
  return (
    <Alert variant="danger" onClose={ () => dispatch(hideError()) } dismissible>
      <h4>{ flash.title }</h4>
      <pre>
        <code>
          { flash.details ? flash.details : flash.details.message }
        </code>
      </pre>
    </Alert>
  )
}

export default Error
