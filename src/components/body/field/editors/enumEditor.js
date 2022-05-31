import startCase from "lodash/startCase"
import { isString, isNumber, isObject, isBoolean } from "lodash"
import { StyledFormSelect } from "./styledForms"

export default function EnumEditor({ field, onChange }) {
  const values = field.values.map((item) => {
    const value = item.value
    let name

    if (item.name) {
      name = item.name
    } else {
      switch (true) {
        case isString(value):
          name = startCase(value)
          break
        case isNumber(value):
        case isBoolean(value):
          name = value.toString()
          break
        case isObject(value):
          name = JSON.stringify(value)
          break
        default:
          name = "name undefined"
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
