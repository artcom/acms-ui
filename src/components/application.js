import { useSelector } from "react-redux"
import Container from "react-bootstrap/Container"
import Body from "./body"
import Error from "./error"
import Header from "./header"
import EntityCreationModal from "./modals/entityCreationModal"
import EntityRenamingModal from "./modals/entityRenamingModal"

const Application = () => {
  const flash = useSelector(state => state.flash)
  const isLoading = useSelector(state => state.originalContent === null)
  return (
    <>
      { !isLoading && <Header /> }
      <Container>
        { flash && <Error /> }
        { !isLoading &&
        <>
          <Body />
          <EntityCreationModal />
          <EntityRenamingModal />
        </>
        }
      </Container>
    </>
  )
}

export default Application
