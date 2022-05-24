import ImageRequirements from "./imageRequirements"
import StringRequirements from "./stringRequirements"
import NumberRequirements from "./numberRequirements"

const Requirements = ({ field }) => {
  switch (field.type) {
    case "image":
      return <ImageRequirements field={field} />
    case "string":
      return <StringRequirements field={field} />
    case "number":
      return <NumberRequirements field={field} />
    default:
      return null
  }
}

export default Requirements
