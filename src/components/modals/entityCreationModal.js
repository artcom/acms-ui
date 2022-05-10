import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import styled from "styled-components"

import {
  cancelEntityCreation,
  finishEntityCreation,
  updateEntityCreationId,
  updateEntityCreationTemplate,
} from "../../actions/entity"
import { selectNewEntity } from "../../selectors"

const StyledFormGroup = styled(Form.Group)`
  margin-top: 1rem;
`

export default function EntityCreationModal() {
  const dispatch = useDispatch()
  const newEntity = useSelector(selectNewEntity)
  const inputField = useRef()

  return (
    <Modal
      onShow={() => inputField.current.focus()}
      show={newEntity.isVisible}
      onHide={() => dispatch(cancelEntityCreation())}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              ref={inputField}
              type="text"
              value={newEntity.id}
              isInvalid={newEntity.isVisible && !newEntity.isValidId}
              onChange={(event) => dispatch(updateEntityCreationId(event.target.value))}
            />
          </Form.Group>
          <StyledFormGroup>
            <Form.Label>Template</Form.Label>
            {newEntity.templates.length === 1 ? (
              <Form.Control readOnly value={newEntity.templates[0]} />
            ) : (
              <Form.Select
                value={newEntity.template}
                onChange={(event) => dispatch(updateEntityCreationTemplate(event.target.value))}
              >
                {newEntity.templates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </Form.Select>
            )}
          </StyledFormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="info"
          disabled={!newEntity.isValidId}
          onClick={(event) => {
            event.preventDefault()
            dispatch(finishEntityCreation())
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
