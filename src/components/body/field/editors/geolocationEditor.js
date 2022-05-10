import styled from "styled-components"
import { FloatingLabel } from "react-bootstrap"
import NumberInput from "./inputs/NumberInput"


const Flexbox = styled.div`
  display: flex;  
  align-items: center;
  position: relative;
  justify-content: space-between;
`

const InnerFlexbox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 49.8%;
`

const StyledFloatingLabel = styled(FloatingLabel)`
  width: 100%;
`

export default function GeolocationEditor({ field, onChange }) {
  return (
    <Flexbox>
      <InnerFlexbox>
        <StyledFloatingLabel label="Latitude">
          <NumberInput
            field={ { value: field.value.lat, min: -90, max: 90 } }
            onChange={ newLat => onChange({ lat: newLat, long: field.value.long }) } />
        </StyledFloatingLabel>
      </InnerFlexbox>
      <InnerFlexbox>
        <StyledFloatingLabel label="Longitude" style={ { borderLeft: "solid lightgray 1px" } }>
          <NumberInput
            field={ { value: field.value.long, min: -180, max: 180 } }
            onChange={ newLong => onChange({ lat: field.value.lat, long: newLong }) } />
        </StyledFloatingLabel>
      </InnerFlexbox>
    </Flexbox>
  )
}
