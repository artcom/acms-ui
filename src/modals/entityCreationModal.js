import startCase from "lodash/startCase"
import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import { cancelEntityCreation, finishEntityCreation, updateEntityCreation } from "../actions/entity"
import { getNewEntity } from "../selectors"

export default connect(mapStateToProps)(EntityCreationModal)

function mapStateToProps(state) {
  return {
    newEntity: getNewEntity(state)
  }
}

function EntityCreationModal({ dispatch, newEntity }) {
  return (
    <Modal show={ newEntity.isVisible } onHide={ () => dispatch(cancelEntityCreation()) }>
      <Form validated={ newEntity.isValidName }>
        <Modal.Header closeButton>
          <Modal.Title>Add Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={ newEntity.name }
              autoFocus
              onChange={ event => dispatch(updateEntityCreation({ name: event.target.value })) } />
          </Form.Group>
          <Form.Group>
            <Form.Label>Template</Form.Label>
            <Form.Control
              as="select"
              value={ newEntity.template }
              disabled={ newEntity.templates.length < 2 }
              onChange={ event => dispatch(updateEntityCreation({
                template: event.target.value
              })) }>
              { newEntity.templates.map(template =>
                <option key={ template } value={ template }>{ template }</option>
              ) }
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            disabled={ !newEntity.isValidName }
            onClick={ event => { event.preventDefault(); dispatch(finishEntityCreation()) } }>
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
