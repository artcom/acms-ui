import Dropzone from "react-dropzone"
import styled, { css } from "styled-components"

const getColorCss = (props) => {
  if (props.isDragAccept) {
    return css`
      background-color: #dff0d8;
      border-color: #3c763d;
      border-style: solid;
    `
  }
  if (props.isDragReject) {
    return css`
      background-color: #f2dede;
      border-color: #a94442;
      border-style: solid;
    `
  }
}

const Container = styled.div`
  border-width: 2px;
  border-color: #555;
  border-style: dashed;
  border-radius: 0.3rem;
  ${(props) => getColorCss(props)}
  padding: 1rem;
  text-align: center;
  width: 100%;
`

export default function FileSelector({ accept, children, onSelect }) {
  return (
    <Dropzone
      accept={accept}
      onDropAccepted={(acceptedFiles) => onSelect(acceptedFiles)}
      multiple={false}
      maxFiles={1}
    >
      {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
        <Container {...getRootProps({ isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          {children}
        </Container>
      )}
    </Dropzone>
  )
}
