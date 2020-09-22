import React from "react"
import { connect } from "react-redux"

import Container from "react-bootstrap/Container"
import { getPathNames } from "../selectors"

import Body from "./body"
import Error from "./error"
import Header from "./header"
import EntityCreationModal from "./modals/entityCreationModal"
import EntityRenamingModal from "./modals/entityRenamingModal"
import FieldLocalizationModal from "./modals/fieldLocalizationModal"

export default connect(mapStateToProps)(Application)

function mapStateToProps(state) {
  return {
    flash: state.flash,
    hasChanged: state.originalContent !== state.changedContent,
    isLoading: state.originalContent === null,
    isSaving: state.isSaving,
    config: state.config,
    path: state.path,
    pathNames: getPathNames(state)
  }
}

function Application(props) {
  return (
    <>
      { !props.isLoading && <Header { ...props } /> }
      <Container>
        { props.flash && <Error { ...props } /> }

        { !props.isLoading &&
        <>
          <Body assetServer={ props.assetServer } />
          <EntityCreationModal />
          <EntityRenamingModal />
          <FieldLocalizationModal />
        </>
        }
      </Container>
    </>
  )
}
