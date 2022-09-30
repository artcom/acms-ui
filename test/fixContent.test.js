import { createNextState } from "@reduxjs/toolkit"

import { fixContent } from "../src/actions/data"

describe("Fix Content", () => {
  test("should not change empty content", () => {
    const originalContent = {}
    const templates = {}
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toBe(originalContent)
  })

  test("should not change empty empty template", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: {} }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toBe(originalContent)
  })

  test("should add missing string field", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "string" }] } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: "" })
  })

  test("should add first value for missing enum field", () => {
    const originalContent = { template: "template1" }
    const templates = {
      template1: {
        fields: [{ id: "foo", type: "enum", values: [{ value: "first" }, { value: "second" }] }],
      },
    }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: "first" })
  })

  test("should add missing boolean field", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "boolean" }] } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: false })
  })

  test("should add missing number field", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "number" }] } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: 0 })
  })

  test("should add missing number field with min/max", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "number", min: 2, max: 4 }] } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: 2 })
  })

  test("should add missing geolocation", () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "geolocation" }] } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1", foo: { lat: 0, long: 0 } })
  })
})
