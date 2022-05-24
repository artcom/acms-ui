const StringRequirements = ({ field }) => {
  if (field && field.maxLength && !field.localization) {
    return <small className="text-muted"> {`${field.value.length}  /  ${field.maxLength} `} </small>
  } else {
    return null
  }
}

export default StringRequirements
