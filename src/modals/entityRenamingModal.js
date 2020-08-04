import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import FormLabel from "react-bootstrap/FormLabel"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import FormGroup from "react-bootstrap/FormGroup"
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
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Rename Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup validationState={ renamedEntity.isValidName ? null : "error" }>
            <FormLabel>Name</FormLabel>
            <FormControl
              type="text"
              value={ renamedEntity.newName }
              autoFocus
              onChange={ event => dispatch(updateEntityRenaming(event.target.value)) } />
          </FormGroup>
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
