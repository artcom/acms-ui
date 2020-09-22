import React from "react"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Navbar from "react-bootstrap/Navbar"

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import styled from "styled-components"
import { saveData } from "../actions/data"
import { fromPath } from "../utils/hash"

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

const Header = ({
  config,
  configPath,
  configServer,
  dispatch,
  hasChanged,
  isSaving,
  path,
  pathNames }
) =>
  <Navbar sticky="top" bg="light" variant="light" className={ "flex-column mb-2" }>
    <Container>
      <Col>
        <Navbar.Text className={ "h2" }>{ config.title }</Navbar.Text>
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
            onClick={ () => dispatch(saveData(configServer, configPath)) }>
            { config.saveLabel }
          </SaveButton>
        </StyledButtonGroup>
      </Col>
    </Container>
  </Navbar>

export default Header
