import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import { cancelEntityRenaming, finishEntityRenaming, updateEntityRenaming } from "../actions/entity"
import { getRenamedEntity } from "../selectors"

export default connect(mapStateToProps)(EntityRenamingModal)

function mapStateToProps(state) {
  return {
    renamedEntity: getRenamedEntity(state)
  }
}

function EntityRenamingModal({ dispatch, renamedEntity }) {
  return (
    <Modal show={ renamedEntity.isVisible } onHide={ () => dispatch(cancelEntityRenaming()) }>
      <Form validated={ renamedEntity.isValidName }>
        <Modal.Header closeButton>
          <Modal.Title>Rename Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={ renamedEntity.newId }
              autoFocus
              onChange={ event => dispatch(updateEntityRenaming(event.target.value)) } />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            disabled={ !renamedEntity.isValidName }
            onClick={ event => { event.preventDefault(); dispatch(finishEntityRenaming()) } }>
            Rename
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
