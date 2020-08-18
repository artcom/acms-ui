import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

import {
  cancelFieldLocalization,
  finishFieldLocalization,
  updateFieldLocalization
} from "../actions/localization"

import { selectFieldLocalization, getLanguages } from "../selectors"

export default connect(mapStateToProps)(FieldLocalizationModal)

function mapStateToProps(state) {
  return {
    fieldLocalization: selectFieldLocalization(state),
    languages: getLanguages(state)
  }
}

function FieldLocalizationModal({ dispatch, fieldLocalization, languages }) {
  return (
    <Modal
      show={ fieldLocalization.isVisible }
      onHide={ () => dispatch(cancelFieldLocalization()) }>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {
            languages.map((language, index) =>
              <Form.Check
                key={ language.id }
                type="checkbox"
                disabled={ index === 0 }
                checked={ fieldLocalization.languageIds[language.id] || false }
                onChange={ event =>
                  dispatch(updateFieldLocalization(language.id, event.target.checked))
                }
                label={ language.name } />
            )
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="info"
          onClick={ event => { event.preventDefault(); dispatch(finishFieldLocalization()) } }>
          Localize
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
