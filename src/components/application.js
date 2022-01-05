import React from "react"

import Container from "react-bootstrap/Container"

import Body from "./body"
import Error from "./error"
import Header from "./header"
import EntityCreationModal from "./modals/entityCreationModal"
import EntityRenamingModal from "./modals/entityRenamingModal"

export default function Application(props) {
  return (
    <>
      { !props.isLoading && <Header { ...props } /> }
      <Container>
        { props.flash && <Error { ...props } /> }

        { !props.isLoading &&
        <>
          <Body acmsAssets={ props.acmsAssets } />
          <EntityCreationModal />
          <EntityRenamingModal />
        </>
        }
      </Container>
    </>
  )
}
