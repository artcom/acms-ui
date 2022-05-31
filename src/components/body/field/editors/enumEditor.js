import startCase from "lodash/startCase"
import { StyledFormSelect } from "./styledForms"

export default function EnumEditor({ field, onChange }) {
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
      value={JSON.stringify(field.value)}
      onChange={(event) => onChange(JSON.parse(event.target.value))}
    >
      {values.map(({ value, name }, index) => (
        <option key={index} value={value}>
          {name}
        </option>
      ))}
    </StyledFormSelect>
  )
}
