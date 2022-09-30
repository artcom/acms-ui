import { evaluate } from "../src/utils/evaluate"

describe("evaluate", () => {
  it("evaluates EQUALS command", () => {
    expect(evaluate(["foo", "EQUALS", "foo"], {})).toBe(true)
    expect(evaluate(["foo", "EQUALS", "bar"], {})).toBe(false)
  })

  it("evaluates NOT command", () => {
    expect(evaluate(["NOT", false], {})).toBe(true)
    expect(evaluate(["NOT", true], {})).toBe(false)
  })

  it("evaluates AND command", () => {
    expect(evaluate([true, "AND", true], {})).toBe(true)
    expect(evaluate([true, "AND", false], {})).toBe(false)
    expect(evaluate([false, "AND", true], {})).toBe(false)
    expect(evaluate([false, "AND", false], {})).toBe(false)
  })

  it("evaluates OR command", () => {
    expect(evaluate([true, "OR", true], {})).toBe(true)
    expect(evaluate([true, "OR", false], {})).toBe(true)
    expect(evaluate([false, "OR", true], {})).toBe(true)
    expect(evaluate([false, "OR", false], {})).toBe(false)
  })

  it("evaluates IN command", () => {
    expect(evaluate([1, "IN", [1, 2, 3]], {})).toBe(true)
    expect(evaluate([4, "IN", [1, 2, 3]], {})).toBe(false)
  })

  it("evaluates GET command", () => {
    expect(evaluate(["GET", "foo"], { foo: 42 })).toBe(42)
  })
})
