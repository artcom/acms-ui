import { forwardRef } from "react"

const RequirementIcon = forwardRef((props, ref) => (
  <i
    {...props}
    ref={ref}
    className="bi bi-info-lg"
    style={{ fontSize: "1.5em", lineHeight: "1em", opacity: "0.6" }}
  ></i>
))

RequirementIcon.displayName = "RequirementIcon"

export default RequirementIcon
