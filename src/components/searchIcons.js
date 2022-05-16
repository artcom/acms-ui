import React from "react"

export const SearchIcon = React.forwardRef((props, ref) => (
  <div {...props} ref={ref}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-search"
      viewBox="0 0 16 16"
    >
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397
        1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0
        1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12
        6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
      />
    </svg>
  </div>
))

SearchIcon.displayName = "SearchIcon"

export const ClearIcon = React.forwardRef((props, ref) => (
  <div {...props} ref={ref}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-x-lg"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
      />
      <path
        fillRule="evenodd"
        d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
      />
    </svg>
  </div>
))

ClearIcon.displayName = "ClearIcon"
