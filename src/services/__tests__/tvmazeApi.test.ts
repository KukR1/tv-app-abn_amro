import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchShowById, fetchShowsPage, searchShowsByName } from "../tvmazeApi"

describe("tvmazeApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("requests shows index page with page parameter", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    })
    vi.stubGlobal("fetch", fetchMock)

    await fetchShowsPage(2)

    expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/shows?page=2", { signal: undefined })
  })

  it("requests show details by id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 123, rating: { average: 7.5 } }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await fetchShowById(123)

    expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/shows/123", { signal: undefined })
  })

  it("returns empty search results for empty query", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const result = await searchShowsByName("   ")

    expect(result).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("encodes non-empty search query", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    })
    vi.stubGlobal("fetch", fetchMock)

    await searchShowsByName("game of thrones")

    expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/search/shows?q=game%20of%20thrones", { signal: undefined })
  })

  it("throws for failed requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal("fetch", fetchMock)

    await expect(fetchShowsPage()).rejects.toThrow("TVMaze request failed with status 500")
  })
})
