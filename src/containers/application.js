import Immutable from "immutable"
import startCase from "lodash/startCase"
import React from "react"
import Alert from "react-bootstrap/Alert"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Navbar from "react-bootstrap/Navbar"
import { connect } from "react-redux"

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import { saveData } from "../actions/data"
import { hideError } from "../actions/error"
import { fromPath } from "../hash"

export default connect(mapStateToProps)(Application)

function mapStateToProps(state) {
  return {
    flash: state.flash,
    hasChanged: !Immutable.is(state.originalContent, state.changedContent),
    isLoading: state.originalContent === null,
    isSaving: state.isSaving,
    path: state.path,
    title: state.title
  }
}

function Application(props) {
  return (
    <>
      { !props.isLoading && renderHeader(props) }
      <Container>
        { renderError(props) }
        { !props.isLoading && props.children }
      </Container>
    </>
  )
}

function renderError({ dispatch, flash }) {
  if (flash) {
    return (
      <Alert variant="danger" onClose={ () => dispatch(hideError()) }>
        <h4>{ flash.title }</h4>
        <pre>
          <code>
            { JSON.stringify(flash.error.response, null, 2) || flash.error.stack }
          </code>
        </pre>
      </Alert>
    )
  }
}

function renderHeader({ title, configPath, configServer, dispatch, hasChanged, isSaving, path }) {
  return (
    <Navbar sticky="top" bg="light" variant="light" className={ "flex-column mb-2" }>
      <Container>
        <Col>
          <Navbar.Text className={ "h2" }>{ title }</Navbar.Text>
          <ButtonGroup aria-label="First group" style={ { width: "100%", height: "3em" } }>
            <Button
              href={ fromPath([]) }
              disabled={ path.length === 0 }
              style={ { fontSize: "2em", lineHeight: "1em" } }>&#8962;
            </Button>
            <Breadcrumb
              style={ { marginBottom: "-16px", width: "100%" } }
              listProps={ { style: { height: "3em" } } }>
              { path.map((item, i) =>
                <Breadcrumb.Item
                  key={ item }
                  href={ fromPath(path.slice(0, i + 1)) }
                  active={ i === path.length - 1 }>
                  { startCase(item) }
                </Breadcrumb.Item>
              ) }
            </Breadcrumb>
            <Button
              style={ { float: "right", width: "100px" } }
              disabled={ !hasChanged || isSaving }
              onClick={ () => dispatch(saveData(configServer, configPath)) }>
              { isSaving ? "Saving..." : "Save" }
            </Button>
          </ButtonGroup>
        </Col>
      </Container>
    </Navbar>
  )
}
