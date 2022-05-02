import React, { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { ListGroup, ListGroupItem } from "react-bootstrap"
import store from "../../store"
import StyledFormControl from "./styledFormControl"
import { ApiContext } from "../../index"

import { cancelEntityRenaming, finishEntityRenaming,
  updateEntityRenaming } from "../../actions/entity"
import { selectRenamedEntity } from "../../selectors"
import { listAllFiles } from "../../actions/listAllFiles"

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
`


export default function AssetBrowserModal() {
  // const dispatch = useDispatch()
  // const renamedEntity = useSelector(selectRenamedEntity)
  const [modalOpen, setModalOpen] = useState(true)
  const [selectedAssets, setSelectedAssets] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const context = useContext(ApiContext)
  const acmsAssets = useContext(ApiContext).acmsAssets
  const acmsApi = useContext(ApiContext).acmsApi

  const acmsConfigPath = useSelector(state => state.acmsConfigPath)

  const toggleAssetSelection = path => {
    if (selectedAssets.includes(path)) {
      setSelectedAssets(selectedAssets.filter(assetPath => assetPath !== path))
    } else {
      setSelectedAssets([...selectedAssets, path])
    }
  }

  console.log("ASSETS", acmsAssets)
  useEffect(() => {
    const updateFiles = async () => {
      const fileList = await store.dispatch(listAllFiles(acmsAssets))
      console.log("FILELIST", fileList)
      setAllFiles(fileList)
    }
    updateFiles()
  }, [])


  return (
    // <Modal show={ renamedEntity.isVisible } onHide={ () => dispatch(cancelEntityRenaming()) }>
    <StyledAssetBrowserModal
      show={ modalOpen }
      onHide={ () => setModalOpen(false) }>
      <Modal.Header closeButton>
        <Modal.Title>Asset Browser</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Name</Form.Label>
        <ListGroup>
          { allFiles.map(file =>
            <ListGroupItem
              key={ file.hash }
              active={ selectedAssets.includes(file.path) }
              onClick={ e => {
                // e.preventDefault()
                toggleAssetSelection(file.path)
              } } >
              <a target="_blank" href={ `${acmsAssets.url}/${file.path}` }>
                <img src={ `${acmsAssets.url}/${file.path}` } />
              </a>
              { file.originalName }
            </ListGroupItem>
          ) }
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="info"
          disabled={ selectedAssets.length === allFiles.length }
          onClick={ e => {
            e.preventDefault()
            setSelectedAssets(allFiles.map(f => f.path))
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

