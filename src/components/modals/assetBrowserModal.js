import React, { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { differenceWith, isEqual } from "lodash"

import Button from "react-bootstrap/Button"
import Form, { FormSelect } from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap"
import store from "../../store"
import StyledFormControl from "./styledFormControl"
import { ApiContext } from "../../index"

import {
  cancelEntityRenaming,
  finishEntityRenaming,
  updateEntityRenaming,
} from "../../actions/entity"
import {
  selectRenamedEntity,
  getChangedContent,
  getOriginalContent,
} from "../../selectors"
import { listAllFiles } from "../../actions/listAllFiles"
import { getAssetsInUse } from "../../actions/data"

const StyledAssetBrowserModal = styled(Modal)`
  & img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    margin-right: 1rem;
  }

  div.list-group-item {
    cursor: pointer;
  }

  div.list-group-item a {
    cursor: zoom-in;
  }

  div.list-group-item:hover {
    background-color: rgba(49, 108, 255, 0.5);
  }

  .badge {
    display: inline-block;
    position: absolute;
    right: 0.5rem;
    top: 1.4rem;
  }
`

export default function AssetBrowserModal() {
  // const dispatch = useDispatch()
  // const renamedEntity = useSelector(selectRenamedEntity)
  const [modalOpen, setModalOpen] = useState(true)
  const [selectedAssets, setSelectedAssets] = useState([])
  const [filteredAssets, setFilteredAssets] = useState([])
  const [allAssets, setAllAssets] = useState([])
  const context = useContext(ApiContext)
  const acmsAssets = useContext(ApiContext).acmsAssets
  const acmsApi = useContext(ApiContext).acmsApi

  const acmsConfigPath = useSelector(state => state.acmsConfigPath)
  const changedContent = useSelector(getChangedContent)
  const originalContent = useSelector(getOriginalContent)
  console.log("CHANGED CONTENT", changedContent, changedContent)

  const toggleAssetSelection = path => {
    if (selectedAssets.includes(path)) {
      setSelectedAssets(
        selectedAssets.filter(assetPath => assetPath !== path)
      )
    } else {
      setSelectedAssets([...selectedAssets, path])
    }
  }

  useEffect(() => {
    const updateAssetsInUse = async () => {
      const assetList = await store.dispatch(getAssetsInUse(acmsAssets))
      console.log("ASSET LIST", assetList)
      setAllAssets(assetList)
      setFilteredAssets(assetList)
    }
    updateAssetsInUse()
  }, [])

  const filterAssets = filterString => {
    if (filterString !== "") {
      setFilteredAssets(
        allAssets.filter(assets =>
          assets.originalName
            .toLocaleLowerCase()
            .includes(filterString.toLocaleLowerCase())
        )
      )
    } else {
      setFilteredAssets(allAssets)
    }
  }

  return (
    // <Modal show={ renamedEntity.isVisible } onHide={ () => dispatch(cancelEntityRenaming()) }>
    <StyledAssetBrowserModal
      show={ modalOpen }
      onHide={ () => setModalOpen(false) }>
      <Modal.Header closeButton>
        <Modal.Title>Asset Browser</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { /* <Form.Label>Name</Form.Label> */ }
        <Form.Group
          controlId="assetBrowser.ControlSearch"
          onChange={ e => {
            e.preventDefault()
            filterAssets(e.target.value)
          } }>
          <Form.Label>Filter</Form.Label>
          <Form.Control type="filter" placeholder="filter string" />
        </Form.Group>
        <Form>
          <Form.Group controlId="assetBrowser.ControlOrder">
            <Form.Label>Order</Form.Label>
            <Form.Control as="select" custom>
              <option>alphabetically</option>
              <option>by creation date</option>
              <option>by usage</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <ListGroup>
          { filteredAssets.map(file =>
            <ListGroup.Item
              key={ file.hash }
              active={ selectedAssets.includes(file.path) }
              onClick={ e => {
                // e.preventDefault()
                toggleAssetSelection(file.path)
              } }>
              <a target="_blank" href={ `${acmsAssets.url}/${file.path}` }>
                <img src={ `${acmsAssets.url}/${file.path}` } />
              </a>
              { file.originalName }
              { file.useCount > 0 &&
                <>
                  { " " }
                  <Badge variant="primary" pill>
                    { file.useCount }
                  </Badge>
                </>
              }
            </ListGroup.Item>
          ) }
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="info"
          disabled={
            differenceWith(
              selectedAssets,
              allAssets.filter(f => f.useCount > 0),
              isEqual
            ).length !== 0
          } // TODO!!!
          onClick={ e => {
            e.preventDefault()
            const inUse = allAssets.filter(f => f.useCount > 0)
            console.log("SELECT IN USE", inUse)
            setSelectedAssets(inUse.map(f => f.path))
          } }>
          Select in use
        </Button>
        <Button
          type="submit"
          variant="info"
          disabled={ selectedAssets.length === allAssets.length }
          onClick={ e => {
            e.preventDefault()
            setSelectedAssets(allAssets.map(f => f.path))
          } }>
          Select all
        </Button>
        <Button
          type="submit"
          variant="info"
          disabled={ selectedAssets.length === 0 }
          onClick={ e => {
            e.preventDefault()
            setSelectedAssets([])
          } }>
          Deselect all
        </Button>
        <Button
          type="submit"
          variant="info"
          disabled={ selectedAssets.length === 0 }
          onClick={ () => {} }>
          Delete
        </Button>
      </Modal.Footer>
    </StyledAssetBrowserModal>
  )
}
