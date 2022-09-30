import { createNextState } from "@reduxjs/toolkit"

import { fixContent } from "../src/actions/data"

describe("Fix Content", () => {
  test("should remove unknown property", () => {
    const templates = { template1: { fields: [], children: [] } }
    const originalContent = { template: "template1", unknown: { template: "unknown" } }
    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )
    expect(changedContent).toEqual({ template: "template1" })
  })

  describe("Fields", () => {
    test("should not change empty content", () => {
      const templates = {}
      const originalContent = {}
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toBe(originalContent)
    })

    test("should not change empty fields", () => {
      const templates = { template1: { fields: [] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toBe(originalContent)
    })

    test("should add missing string field", () => {
      const templates = { template1: { fields: [{ id: "foo", type: "string" }] } }
      const originalContent = { template: "template1" }
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
      const templates = { template1: { fields: [{ id: "foo", type: "boolean" }] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toEqual({ template: "template1", foo: false })
    })

    test("should add missing number field", () => {
      const templates = { template1: { fields: [{ id: "foo", type: "number" }] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toEqual({ template: "template1", foo: 0 })
    })

    test("should add missing number field with min/max", () => {
      const templates = { template1: { fields: [{ id: "foo", type: "number", min: 2, max: 4 }] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toEqual({ template: "template1", foo: 2 })
    })

    test("should add missing geolocation", () => {
      const templates = { template1: { fields: [{ id: "foo", type: "geolocation" }] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toEqual({ template: "template1", foo: { lat: 0, long: 0 } })
    })
  })

  describe("Children", () => {
    test("should not change empty children", () => {
      const templates = { template1: { children: [] } }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toBe(originalContent)
    })

    test("should add missing children", () => {
      const templates = {
        template1: { children: [{ id: "foo", template: "template2" }] },
        template2: {},
      }
      const originalContent = { template: "template1" }
      const changedContent = createNextState(originalContent, (draft) =>
        fixContent(originalContent, draft, templates)
      )
      expect(changedContent).toEqual({ template: "template1", foo: { template: "template2" } })
    })
  })
})
