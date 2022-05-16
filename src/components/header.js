import { useContext } from "react"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Navbar from "react-bootstrap/Navbar"

import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { ApiContext } from "../index"

import SearchForm from "./searchForm"
import { saveData } from "../actions/data"
import { fromPath } from "../utils/hash"
import { getPathNames, selectTemplateId, selectAllSiblingTemplates } from "../selectors"
import HomeIcon from "./body/field/icons/homeIcon"

const Logo = styled.img`
  width: auto;
  padding-right: 1rem;
  max-height: 150px;
  padding-bottom: 0.5rem;
`
const LogoContainer = styled(Row)`
  justify-content: center;
  align-items: center;
`

const Title = styled(Navbar.Text)`
  margin-bottom: 0px;
  padding-bottom: 0.5rem;
`

const StyledButtonGroup = styled(ButtonGroup)`
  width: 100%;
  min-height: 3em;
  background-color: #e9ecef;
`

const SaveButton = styled(Button)`
  width: 100px;
  flex: 1 0 auto;
`

const HomeButton = styled(Button)`
  display: flex;
  align-items: center;
`

const StyledBreadcrumb = styled(Breadcrumb)`
  width: 100%;
  margin-bottom: -16px;
`

const Template = styled.div`
  margin-left: 1em;
`

const Header = () => {
  const dispatch = useDispatch()
  const config = useSelector((state) => state.config)
  const hasChanged = useSelector((state) => state.originalContent !== state.changedContent)
  const isSaving = useSelector((state) => state.isSaving)
  const path = useSelector((state) => state.path)
  const pathNames = useSelector(getPathNames)
  const acmsConfigPath = useSelector((state) => state.acmsConfigPath)
  const context = useContext(ApiContext)
  const templateId = useSelector(selectTemplateId)
  const siblingTemplates = useSelector(selectAllSiblingTemplates)

  return (
    <Navbar sticky="top" bg="light" variant="light" className={"flex-column mb-2"}>
      <Container>
        <Col>
          <LogoContainer>
            {config.logoImageUri && <Logo src={config.logoImageUri} />}
            {config.title && <Title className={"h1"}>{config.title}</Title>}
          </LogoContainer>
          <StyledButtonGroup aria-label="First group">
            <HomeButton variant="secondary" href={fromPath([])} disabled={path.length === 0}>
              <HomeIcon />
            </HomeButton>
            <StyledBreadcrumb
              listProps={{
                style: {
                  minHeight: "3em",
                  alignItems: "center",
                  backgroundColor: "#e9ecef",
                  paddingLeft: "1rem",
                },
              }}
            >
              {path.map((item, i) => (
                <Breadcrumb.Item
                  key={i}
                  href={fromPath(path.slice(0, i + 1))}
                  active={i === path.length - 1}
                >
                  {pathNames[i]}
                </Breadcrumb.Item>
              ))}
              {siblingTemplates && siblingTemplates.length > 1 && (
                <Template className="text-muted" data-toggle="tooltip" title={templateId}>
                  {`(${templateId.split("/").at(-1)})`}
                </Template>
              )}
            </StyledBreadcrumb>
            <SaveButton
              disabled={!hasChanged || isSaving}
              onClick={() => dispatch(saveData(context.acmsApi, acmsConfigPath))}
            >
              {config.saveLabel}
            </SaveButton>
            <SearchForm acmsApi={context.acmsApi} acmsConfigPath={acmsConfigPath} />
          </StyledButtonGroup>
        </Col>
      </Container>
    </Navbar>
  )
}
export default Header
