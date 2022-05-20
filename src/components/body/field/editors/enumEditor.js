import startCase from "lodash/startCase"
import { useEffect, useState } from "react"
import { StyledFormSelect } from "./styledForms"

export default function EnumEditor({ field, onChange }) {
  const [selectedOption, setSelectedOption] = useState(findValue(field.values, field.value, false))
  console.log("🚀 ~ selectedOption", selectedOption)

  const values = field.values.map((item) => {
    const value = item.value
    let name

    if (item.name) {
      name = item.name
    } else {
      switch (typeof value) {
        case "string":
          name = startCase(value)
          break
        case "number":
        case "boolean":
          name = value.toString()
          break
        case "object":
          name = JSON.stringify(value)
          break
        default:
          name = "undefined"
          break
      }
    }

    return { value: JSON.stringify(value), name }
  })

  return (
    <StyledFormSelect
      value={selectedOption.name}
      onChange={(event) => {
        setSelectedOption(findValue(values, event.target.value, true))
        onChange(JSON.parse(event.target.value))
      }}
    >
      {values.map(({ value, name }, index) => (
        <option key={index} value={value}>
          {name}
        </option>
      ))}
    </StyledFormSelect>
  )
}

function findValue(values, value, parse) {
  return values.find((option) => {
    if (parse && value === JSON.parse(option.value)) {
      return true
    } else {
      if (value === option.value) {
        return true
      }
    }
  })
}
