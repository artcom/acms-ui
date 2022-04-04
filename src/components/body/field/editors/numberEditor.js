import React from "react"
import NumberInput from "./inputs/NumberInput"

export default function NumberEditor({ field, onChange }) {
  return (
    <NumberInput
      field={ field }
      onChange={ onChange } />
  )
}
