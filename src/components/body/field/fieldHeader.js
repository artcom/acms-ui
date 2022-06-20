import Dropdown from "react-bootstrap/Dropdown"
import DropdownItem from "react-bootstrap/DropdownItem"
import styled from "styled-components"

import { undoChanges, clearSrcTag } from "../../../actions/value"

import { startCase } from "lodash"

import ToggleButton from "../../toggleButton"
import Requirements from "./requirements"
// import Infos from "./infos"

const StyledDropdown = styled(Dropdown)`
  margin-left: 0.5rem;
`

const Fieldname = styled.div`
  margin-right: auto;
`

const Flexbox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const FieldHeader = ({ field, dispatch }) => (
  <Flexbox>
    {/* <Infos field={field} /> */}
    <Fieldname>{field.name ? field.name : startCase(field.id)}</Fieldname>
    <Requirements field={field} />
    <StyledDropdown id={field.id}>
      <Dropdown.Toggle as={ToggleButton} />
      <Dropdown.Menu>
        <DropdownItem
          key="undo"
          disabled={!field.hasChanged || field.isNew}
          onClick={() => dispatch(undoChanges(field.path))}
        >
          Undo Changes
        </DropdownItem>
        {(field.type === "image" ||
          field.type === "video" ||
          field.type === "audio" ||
          field.type === "file") && (
          <DropdownItem
            key="clear"
            disabled={field.value.hashedPath === ""}
            onClick={() => dispatch(clearSrcTag(field.path))}
          >
            Clear
          </DropdownItem>
        )}
      </Dropdown.Menu>
    </StyledDropdown>
  </Flexbox>
)

export default FieldHeader
