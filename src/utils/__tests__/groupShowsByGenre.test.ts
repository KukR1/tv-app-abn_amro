import { describe, expect, it } from "vitest"

import type { TvMazeShow } from "../../types/tvmaze"
import { groupShowsByGenre } from "../groupShowsByGenre"

function createShow(id: number, name: string, genres: string[], rating: number | null): TvMazeShow {
  return {
    id,
    name,
    genres,
    rating: { average: rating },
    summary: null,
    image: null,
    language: "English",
    premiered: null,
    status: null,
    runtime: null,
  }
}

describe("groupShowsByGenre", () => {
  it("groups shows by genre", () => {
    const shows = [createShow(1, "A", ["Drama", "Comedy"], 8.1), createShow(2, "B", ["Drama"], 7.9)]

    const grouped = groupShowsByGenre(shows)

    expect(grouped.map((item) => item.genre)).toEqual(["Drama", "Comedy"])
    expect(grouped).toHaveLength(2)

    const [dramaGroup, comedyGroup] = grouped
    if (!dramaGroup || !comedyGroup) {
      throw new Error("Expected two genre groups")
    }

    expect(dramaGroup.shows).toHaveLength(2)
    expect(comedyGroup.shows).toHaveLength(1)
  })

  it("sorts each genre by rating descending with null ratings last", () => {
    const shows = [createShow(1, "Low", ["Drama"], 6.8), createShow(2, "NoRating", ["Drama"], null), createShow(3, "High", ["Drama"], 9.3)]

    const [dramaGroup] = groupShowsByGenre(shows)
    if (!dramaGroup) {
      throw new Error("Expected a drama group")
    }

    expect(dramaGroup.shows.map((show) => show.name)).toEqual(["High", "Low", "NoRating"])
  })
})
