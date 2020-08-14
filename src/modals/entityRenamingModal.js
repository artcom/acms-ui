import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import { cancelEntityRenaming, finishEntityRenaming, updateEntityRenaming } from "../actions/entity"
import { selectRenamedEntity } from "../selectors"

export default connect(mapStateToProps)(EntityRenamingModal)

function mapStateToProps(state) {
  return {
    renamedEntity: selectRenamedEntity(state)
  }
}

function EntityRenamingModal({ dispatch, renamedEntity }) {
  console.log(renamedEntity)
  return (
    <Modal show={ renamedEntity.isVisible } onHide={ () => dispatch(cancelEntityRenaming()) }>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Rename Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <div style={ { position: "relative" } }>
            <Form.Control
              type="text"
              style={ { boxShadow: "none" } }
              value={ renamedEntity.newId }
              isInvalid={ renamedEntity.isVisible && !renamedEntity.isValidId }
              autoFocus
              onChange={ event => dispatch(updateEntityRenaming(event.target.value)) } />
            <Form.Control.Feedback type="invalid" tooltip>
              Contains invalid characters or id already exists
            </Form.Control.Feedback>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            disabled={ !renamedEntity.isValidId }
            onClick={ event => { event.preventDefault(); dispatch(finishEntityRenaming()) } }>
            Rename
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
