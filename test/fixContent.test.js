import { createNextState } from "@reduxjs/toolkit"

import { fixContent } from "../src/actions/data"

describe("Fix Content", () => {
  test("should not change empty content", async () => {
    const originalContent = {}
    const templates = {}

    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )

    expect(changedContent).toBe(originalContent)
  })

  test("should not change empty empty template", async () => {
    const originalContent = { template: "template1" }
    const templates = { template1: {} }

    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )

    expect(changedContent).toBe(originalContent)
  })

  test("should add missing string field", async () => {
    const originalContent = { template: "template1" }
    const templates = { template1: { fields: [{ id: "foo", type: "string" }] } }

    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )

    expect(changedContent).toEqual({ template: "template1", foo: "" })
  })

  test("should add first value for missing enum field", async () => {
    const originalContent = { template: "template1" }
    const templates = {
      template1: { fields: [{ id: "foo", type: "enum", values: ["first", "second"] }] },
    }

    const changedContent = createNextState(originalContent, (draft) =>
      fixContent(originalContent, draft, templates)
    )

    expect(changedContent).toEqual({ template: "template1", foo: "first" })
  })
})
