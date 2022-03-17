import React from "react"
import styled from "styled-components"
import Card from "react-bootstrap/Card"
import NumberInput from "./inputs/NumberInput"

const StyledCardLabel = styled(Card.Header)`
  display: flex;
  border: 0px;
`

const Flexbox = styled.div`
  display: flex;
  align-items: center;
`

export default function GeolocationEditor({ field, onChange }) {
  return (
    <Flexbox>
      <StyledCardLabel className="card-text">Latitude</StyledCardLabel>
      <NumberInput
        field={ { value: field.value.lat, min: -90, max: 90 } }
        onChange={ newLat => onChange({ lat: newLat, lon: field.value.lon }) } />
      <StyledCardLabel className="card-text">Longitude</StyledCardLabel>
      <NumberInput
        field={ { value: field.value.lon, min: -180, max: 180 } }
        onChange={ newLon => onChange({ lat: field.value.lat, lon: newLon }) } />
    </Flexbox>
  )
}
