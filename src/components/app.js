import React from "react"
import { connect } from "react-redux"

import Container from "react-bootstrap/Container"
import { getPathNames } from "../selectors"

import Entity from "./entity"
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
    title: state.config.title,
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
          <Entity assetServer={ props.assetServer } />
          <EntityCreationModal />
          <EntityRenamingModal />
          <FieldLocalizationModal />
        </>
        }
      </Container>
    </>
  )
}
