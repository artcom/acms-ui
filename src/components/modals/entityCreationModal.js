import React from "react"
import { connect } from "react-redux"

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

export default connect(mapStateToProps)(EntityCreationModal)

function mapStateToProps(state) {
  return {
    newEntity: selectNewEntity(state)
  }
}

function EntityCreationModal({ dispatch, newEntity }) {
  return (
    <Modal show={ newEntity.isVisible } onHide={ () => dispatch(cancelEntityCreation()) }>
      <Modal.Header closeButton>
        <Modal.Title>New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Name</Form.Label>
        <div style={ { position: "relative" } }>
          <StyledFormControl
            type="text"
            value={ newEntity.id }
            isInvalid={ newEntity.isVisible && !newEntity.isValidId }
            autoFocus
            onChange={
              event => dispatch(updateEntityCreationId(event.target.value))
            } />
        </div>
        {
          newEntity.templates.length > 1 &&
          <Form.Group>
            <Form.Label>Template</Form.Label>
            <Form.Control
              as="select"
              value={ newEntity.template }
              onChange={ event => dispatch(updateEntityCreationTemplate(event.target.value)) }>
              { newEntity.templates.map(template =>
                <option key={ template } value={ template }>{ template }</option>
              ) }
            </Form.Control>
          </Form.Group>
        }
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
    </Modal>
  )
}
