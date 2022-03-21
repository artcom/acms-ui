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
  position: relative;
`

export default function GeolocationEditor({ field, onChange }) {
  return (
    <Flexbox>
      <Flexbox>
        <StyledCardLabel className="card-text">Latitude</StyledCardLabel>
        <NumberInput
          field={ { value: field.value.lat, min: -90, max: 90 } }
          onChange={ newLat => onChange({ lat: newLat, long: field.value.long }) } />
      </Flexbox>
      <Flexbox>
        <StyledCardLabel className="card-text">Longitude</StyledCardLabel>
        <NumberInput
          field={ { value: field.value.long, min: -180, max: 180 } }
          onChange={ newLong => onChange({ lat: field.value.lat, long: newLong }) } />
      </Flexbox>
    </Flexbox>
  )
}
