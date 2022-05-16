import styled from "styled-components"

const IconContainer = styled.div`
  margin-top: -10px;
  height: 1em;
  font-size: 1.5em;
`

const HomeIcon = () => {
  return (
    <IconContainer>
      <i className="bi bi-house"></i>
    </IconContainer>
  )
}

export default HomeIcon
