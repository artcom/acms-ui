import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import {
  cancelEntityRenaming,
  finishEntityRenaming,
  updateEntityRenaming,
} from "../../actions/entity"
import { selectRenamedEntity } from "../../selectors"

export default function EntityRenamingModal() {
  const dispatch = useDispatch()
  const renamedEntity = useSelector(selectRenamedEntity)
  const inputField = useRef()

  return (
    <Modal
      onShow={() => inputField.current.focus()}
      show={renamedEntity.isVisible}
      onHide={() => dispatch(cancelEntityRenaming())}
    >
      <Modal.Header closeButton>
        <Modal.Title>Rename Child</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              ref={inputField}
              type="text"
              value={renamedEntity.newId}
              isInvalid={renamedEntity.isVisible && !renamedEntity.isValidId}
              autoFocus
              onChange={(event) => dispatch(updateEntityRenaming(event.target.value))}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            disabled={!renamedEntity.isValidId}
            onClick={(event) => {
              event.preventDefault()
              dispatch(finishEntityRenaming())
            }}
          >
            Rename
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
