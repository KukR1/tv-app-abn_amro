import { describe, expect, it } from "vitest"

import { formatRating, formatValue, stripHtmlTags } from "../showFormatters"

describe("showFormatters", () => {
  it("formats rating with one decimal and handles null", () => {
    expect(formatRating(8.345)).toBe("8.3")
    expect(formatRating(null)).toBe("N/A")
  })

  it("strips html tags from summaries", () => {
    expect(stripHtmlTags("<p><b>Great</b> story</p>")).toBe("Great story")
    expect(stripHtmlTags(null)).toBe("")
  })

  it("formats nullable metadata values", () => {
    expect(formatValue("English")).toBe("English")
    expect(formatValue(45)).toBe("45")
    expect(formatValue(null)).toBe("Unknown")
  })
})
