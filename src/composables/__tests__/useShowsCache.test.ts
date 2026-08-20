import { beforeEach, describe, expect, it } from "vitest"

import { useShowsCache } from "../useShowsCache"
import type { TvMazeShow } from "../../types/tvmaze"

function makeShow(id: number): TvMazeShow {
  return {
    id,
    name: `Show ${id}`,
    genres: [],
    rating: { average: null },
    summary: null,
    image: null,
    language: null,
    premiered: null,
    status: null,
    runtime: null,
  }
}

describe("useShowsCache", () => {
  beforeEach(() => {
    const { clearCache } = useShowsCache()
    clearCache()
  })

  it("returns null when cache is empty", () => {
    const { getCache } = useShowsCache()
    expect(getCache()).toBeNull()
  })

  it("returns cached shows after setting them", () => {
    const { getCache, setCache } = useShowsCache()
    const shows = [makeShow(1), makeShow(2)]

    setCache(shows)

    expect(getCache()).toEqual(shows)
  })

  it("clears the cache", () => {
    const { getCache, setCache, clearCache } = useShowsCache()

    setCache([makeShow(1)])
    clearCache()

    expect(getCache()).toBeNull()
  })

  it("shared cache is visible across composable instances", () => {
    const instance1 = useShowsCache()
    const instance2 = useShowsCache()

    instance1.setCache([makeShow(99)])

    expect(instance2.getCache()).toEqual([makeShow(99)])
  })
})
