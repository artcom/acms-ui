import React from "react"

const NumberRequirements = ({ field }) =>
  <small className="text-muted"> { field.integer ? "Integer" : "Float" } </small>

export default NumberRequirements
