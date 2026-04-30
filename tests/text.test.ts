import { describe, expect, test } from "bun:test"
import { compact, lines, truncate } from "../src/utils/text"

describe("text utilities", () => {
  test("compacts sparse text", () => {
    expect(compact(" one\n\n two\tthree ")).toBe("one two three")
    expect(compact(null)).toBe("Not provided")
  })

  test("truncates long text with a clear suffix", () => {
    expect(truncate("abcdef", 10)).toBe("abcdef")
    expect(truncate("abcdefghijklmnopqrstuvwxyz", 20)).toBe("abcde... [truncated]")
  })

  test("joins only useful lines", () => {
    expect(lines(["one", false, "", null, "two"])).toBe("one\ntwo")
  })
})
