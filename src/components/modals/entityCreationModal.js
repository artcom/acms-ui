import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import StyledFormControl from "./styledFormControl"


import { cancelEntityCreation,
  finishEntityCreation,
  updateEntityCreationId,
  updateEntityCreationTemplate
} from "../../actions/entity"
import { selectNewEntity } from "../../selectors"

export default function EntityCreationModal() {
  const dispatch = useDispatch()
  const newEntity = useSelector(selectNewEntity)
  const inputField = useRef()

  return (
    <Modal
      onShow={ () => inputField.current.focus() }
      show={ newEntity.isVisible }
      onHide={ () => dispatch(cancelEntityCreation()) }>
      <Modal.Header closeButton>
        <Modal.Title>New Item</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <div style={ { position: "relative" } }>
              <StyledFormControl
                ref={ inputField }
                type="text"
                value={ newEntity.id }
                isInvalid={ newEntity.isVisible && !newEntity.isValidId }
                onChange={ event => dispatch(updateEntityCreationId(event.target.value)) } />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Template</Form.Label>
            { newEntity.templates.length === 1 ?
              <Form.Control
                readOnly
                value={ newEntity.templates[0] } />
              :
              <Form.Control
                as="select"
                value={ newEntity.template }
                onChange={ event => dispatch(updateEntityCreationTemplate(event.target.value)) }>
                { newEntity.templates.map(template =>
                  <option key={ template } value={ template }>{ template }</option>
                ) }
              </Form.Control>
            }
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            disabled={ !newEntity.isValidId }
            onClick={ event => { event.preventDefault(); dispatch(finishEntityCreation()) } }>
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
