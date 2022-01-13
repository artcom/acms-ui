import React, { useContext } from "react"
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

import { saveData } from "../actions/data"
import { fromPath } from "../utils/hash"
import { getPathNames } from "../selectors"

const Logo = styled.img`
  width: auto;
  padding-right: 1.0rem;
  max-height: 150px;
  padding-bottom: 0.5rem;
`
const LogoContainer = styled(Row)`
    margin: 0px;
    align-items: center;
`

const Title = styled(Navbar.Text)`
  margin-bottom: 0px;
  padding-bottom: 0.5rem;
`

const StyledButtonGroup = styled(ButtonGroup)`
  width: 100%;
  min-height: 3em;
`

const SaveButton = styled(Button)`
  float: right;
  width: 100px;
`

const HomeButton = styled(Button)`
  display: flex;
  align-items: center;
`

const HomeIcon = styled.div`
  margin-top: -10px;
  font-size: 2.5em;
  line-height: 1em;
`

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: -16px;
  width: 100%;
`

const Header = ({ acmsConfigPath }) => {
  const dispatch = useDispatch()
  const config = useSelector(state => state.config)
  const hasChanged = useSelector(state => state.originalContent !== state.changedContent)
  const isSaving = useSelector(state => state.isSaving)
  const path = useSelector(state => state.path)
  const pathNames = useSelector(getPathNames)

  const context = useContext(ApiContext)


  return (
    <Navbar sticky="top" bg="light" variant="light" className={ "flex-column mb-2" }>
      <Container>
        <Col>
          <LogoContainer>
            { config.logoImageUri && <Logo src={ config.logoImageUri } /> }
            { config.title && <Title className={ "h1" }>{ config.title }</Title> }
          </LogoContainer>
          <StyledButtonGroup aria-label="First group">
            <HomeButton
              variant="secondary"
              href={ fromPath([]) }
              disabled={ path.length === 0 }>
              <HomeIcon >
                &#8962;
              </HomeIcon>
            </HomeButton>
            <StyledBreadcrumb
              listProps={ { style: { minHeight: "3em" } } }>
              { path.map((item, i) =>
                <Breadcrumb.Item
                  key={ i }
                  href={ fromPath(path.slice(0, i + 1)) }
                  active={ i === path.length - 1 }>
                  { pathNames[i] }
                </Breadcrumb.Item>
              ) }
            </StyledBreadcrumb>
            <SaveButton
              disabled={ !hasChanged || isSaving }
              onClick={ () => dispatch(saveData(context.acmsApi, acmsConfigPath)) }>
              { config.saveLabel }
            </SaveButton>
          </StyledButtonGroup>
        </Col>
      </Container>
    </Navbar>
  )
}
export default Header

