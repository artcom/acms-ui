import Button from "react-bootstrap/Button"
import { Play } from "react-bootstrap-icons"
import styled from "styled-components"

const StyledButton = styled(Button)`
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
`

const PreviewButton = ({ preview, value }) => {
  return (
    <StyledButton
      variant="secondary"
      href={preview.replaceAll("${value}", encodeURIComponent(JSON.stringify(value)))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Play size={25} opacity={0.6} />
    </StyledButton>
  )
}

export default PreviewButton
