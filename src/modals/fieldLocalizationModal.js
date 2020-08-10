import React from "react"
import { connect } from "react-redux"

import Button from "react-bootstrap/Button"
import FormCheck from "react-bootstrap/FormCheck"
import FormLabel from "react-bootstrap/FormLabel"
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import Badge from "react-bootstrap/Badge"
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
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Localize Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>Languages</FormLabel>
            {
              languages.map((language, index) => {
                const isDefault = index === 0

                return (
                  <FormCheck
                    key={ language.id }
                    disabled={ isDefault }
                    checked={ fieldLocalization.languageIds.get(language.id) }
                    onChange={ event =>
                      dispatch(updateFieldLocalization(language.id, event.target.checked))
                    }>
                    { language.name } { isDefault && <Badge>Default</Badge> }
                  </FormCheck>
                )
              })
            }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="info"
            onClick={ event => { event.preventDefault(); dispatch(finishFieldLocalization()) } }>
            Localize
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
