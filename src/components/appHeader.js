import React from "react"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Navbar from "react-bootstrap/Navbar"

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import { saveData } from "../actions/data"
import { fromPath } from "../utils/hash"

const Header = ({
  title,
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
        <Navbar.Text className={ "h2" }>{ title }</Navbar.Text>
        <ButtonGroup aria-label="First group" style={ { width: "100%", minHeight: "3em" } }>
          <Button
            variant="secondary"
            href={ fromPath([]) }
            disabled={ path.length === 0 }
            style={ { display: "flex", alignItems: "center" } }>
            <div style={ { marginTop: "-10px", fontSize: "2.5em", lineHeight: "1em" } }>
              &#8962;
            </div>
          </Button>
          <Breadcrumb
            style={ { marginBottom: "-16px", width: "100%" } }
            listProps={ { style: { minHeight: "3em" } } }>
            { path.map((item, i) =>
              <Breadcrumb.Item
                key={ item }
                href={ fromPath(path.slice(0, i + 1)) }
                active={ i === path.length - 1 }>
                { pathNames[i] }
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

export default Header
