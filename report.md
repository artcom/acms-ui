# Content Download, Template Linkage, and Orphan-File Handling in acms-ui

## Summary

`acms-ui` downloads the entire content tree as a single JSON document, then
walks it recursively against the template definitions. Any node whose
`template` attribute does not resolve to a template allowed at that position
is silently dropped from the **editable draft** (while staying in the
**original snapshot**). The UI detects this original-vs-draft mismatch and
renders the affected item as a disabled, red ("danger") list entry — in
effect "offered for deletion" — with only an **Undo Changes** action
available. The node is permanently removed from the backend only once the
user saves, because the save step serializes the draft (which no longer
contains the orphan) back to files.

There is no separate "scan for untemplated files" feature or bulk cleanup
dialog — this is a side effect of how every load reconciles content against
templates.

## Step-by-step process

### 1. Download content and templates

`src/actions/data.js:7-22` — `loadData`:

```js
export function loadData(acmsApi, acmsConfigPath) {
  return async (dispatch) => {
    try {
      const { data: config } = await acmsApi.queryJson(acmsConfigPath)
      const [{ data: unresolvedTemplates }, { data: originalContent }] = await Promise.all([
        acmsApi.queryFiles(config.templatesPath),
        acmsApi.queryJson(config.contentPath),
      ])

      const templates = createNextState(unresolvedTemplates, (draft) =>
        resolveCustomTypes(unresolvedTemplates, draft, config.customTypes),
      )

      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates),
      )
      ...
```

- `acmsApi.queryJson(config.contentPath)` (`src/apis/acmsApi.js`) fetches the
  whole content tree as one JSON object — `originalContent`.
- `fixContent` then produces `changedContent`, a draft copy with invalid
  entries removed/repaired.
- Both `originalContent` and `changedContent` are stored in Redux state
  (`src/reducers.js:31-33`).

### 2. Check each node's `template` attribute against the parent template

`src/actions/data.js:65-108` — `fixContent` (recursive):

```js
function fixContent(content, draft, templates) {
  const { template, ...allEntries } = content
  const { fields = [], fixedChildren = [], children = [] } = utils.getTemplate(template, templates)

  ...

  // fix additional children
  const namedEntries = [...fields, ...fixedChildren].map(({ id }) => id)
  const additionalChildIds = Object.keys(allEntries).filter((id) => !namedEntries.includes(id))
  additionalChildIds.forEach((id) => {
    if (!children.includes(content[id].template)) {
      // delete children with invalid template
      delete draft[id]
    } else {
      fixContent(content[id], draft[id], templates)
    }
  })
}
```

For every child node that isn't a declared field or fixed child, its
`template` value is checked against `children` — the list of template ids
the *parent's* template allows. A node with **no `template` attribute**
(`content[id].template === undefined`) can never be in that list, so it is
always deleted from `draft` (the future `changedContent`). `originalContent`
is left untouched, since it's built directly from the raw API response.

`utils.getTemplate` (`src/utils/index.js:9-19`) resolves a template id to its
definition (falling back to an empty `DEFAULT_TEMPLATE` if unknown), which is
how a bogus/missing template is treated the same as "not allowed here."

### 3. Detect the original-vs-draft mismatch

`src/selectors.js:183-212` — `selectChildren`:

```js
const selectChildren = createSelector(
  [selectTemplate, selectOriginalEntity, selectChangedEntity, selectTemplates, getPath],
  (template, originalEntity = {}, changedEntity, templates, path) => {
    const allIds = Object.keys({ ...originalEntity, ...changedEntity })
    ...
    return allIds
      .filter((id) => id !== TEMPLATE_KEY && !fieldIds.includes(id) && !fixedChildIds.includes(id))
      .sort()
      .map((id) => {
        const originalChildContent = originalEntity[id]
        const changedChildContent = changedEntity[id]
        ...
        return {
          id,
          name: startCase(id),
          hasChanged: originalChildContent !== changedChildContent,
          isNew: isUndefined(originalChildContent),
          isDeleted: isUndefined(changedChildContent),
          ...
        }
      })
  },
)
```

`allIds` is built from the union of keys in both `originalEntity` and
`changedEntity`, so an orphaned node (present originally, stripped from the
draft) still shows up in the list — flagged with `isDeleted: true`.

### 4. Render it as "offered for deletion"

`src/components/body/childItem.jsx:42-81`:

```jsx
const ChildItem = ({ child, children }) => (
  <StyledListGroupItem key={child.id} variant={childStyle(child)}>
    <TextContainer>
      {child.isDeleted ? (
        <ItemName>{child.name}</ItemName>
      ) : (
        <ItemLink href={fromPath(child.path)} ...>{child.name}</ItemLink>
      )}
      ...

function childStyle(child) {
  if (child.isNew) return "success"
  if (child.isDeleted) return "danger"
  if (child.hasChanged) return "warning"
  return ""
}
```

A `isDeleted` child renders as plain (non-clickable) text in a red
("danger") list item instead of a link.

`src/components/body/index.jsx:148-182` — `renderChildren`:

```jsx
<DropDownItem disabled={child.isDeleted} onClick={() => dispatch(startEntityRenaming(child.id))}>
  Rename...
</DropDownItem>
<DropDownItem disabled={!child.hasChanged || child.isNew} onClick={() => dispatch(undoChanges(child.path))}>
  Undo Changes
</DropDownItem>
<DropDownItem disabled={child.isDeleted} onClick={() => dispatch(deleteEntity(child.path))}>
  Delete
</DropDownItem>
```

Rename and (explicit) Delete are disabled because the item is already gone
from the draft — the only enabled action is **Undo Changes**, which restores
the node from `originalContent` back into the draft
(`src/actions/value.js`).

### 5. Finalize removal on save

`src/actions/data.js:110-147` — `saveData` / `toFiles`:

```js
export function saveData(acmsApi, acmsConfigPath) {
  return async (dispatch, getState) => {
    ...
    const content = getChangedContent(state)
    ...
    const contentFiles = toFiles(content, templates)
    await acmsApi.save(contentFiles, contentPath, version)
    dispatch(loadData(acmsApi, acmsConfigPath))
  }
}
```

`toFiles` serializes only `changedContent` into the file map sent to the
API. Since the untemplated node was already removed from the draft in step 2,
it's simply absent from the saved output — completing its deletion from the
backend content store.

## Key files and line references

| File | Lines | Role |
| --- | --- | --- |
| `src/actions/data.js` | 7-39 | `loadData` — fetch config, templates, content |
| `src/actions/data.js` | 65-108 | `fixContent` — drop/repair nodes against template rules |
| `src/actions/data.js` | 110-147 | `saveData` / `toFiles` — write draft back to files |
| `src/apis/acmsApi.js` | ~11-26 | `queryJson` / `queryFiles` — raw API fetch |
| `src/utils/index.js` | 9-19 | `getTemplate` — resolve template id, default fallback |
| `src/reducers.js` | 31-33 | Store `originalContent` / `changedContent` / `templates` |
| `src/selectors.js` | 183-212 | `selectChildren` — compute `isDeleted` from the diff |
| `src/components/body/childItem.jsx` | 42-81 | Render orphan as plain red ("danger") item |
| `src/components/body/index.jsx` | 148-182 | Disable Rename/Delete, enable only Undo Changes |
