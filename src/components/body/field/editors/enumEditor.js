import startCase from "lodash/startCase"
import { isString, isNumber, isBoolean, isEqual } from "lodash"
import { StyledFormSelect } from "./styledForms"

export default function EnumEditor({ field, onChange }) {
  const values = field.values.map(({ value, name }, index) => {
    if (!name) {
      switch (true) {
        case isString(value):
          name = startCase(value)
          break
        case isNumber(value):
        case isBoolean(value):
          name = value.toString()
          break
        default:
          name = index.toString()
          break
      }
    }

    return { value, name }
  })

  return (
    <StyledFormSelect
      value={values.findIndex((element) => isEqual(field.value, element.value))}
      onChange={(event) => onChange(values[event.target.value].value)}
    >
      {values.map(({ name }, index) => (
        <option key={index} value={index}>
          {name}
        </option>
      ))}
    </StyledFormSelect>
  )
}
