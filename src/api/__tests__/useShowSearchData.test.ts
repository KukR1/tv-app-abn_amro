import { afterEach, describe, expect, it, vi } from "vitest"
import { executeSearch, getSearchDebounceMs } from "../useShowSearchData"
import type { TvMazeSearchResult } from "../../types/tvmaze"
import * as tvmazeApi from "../../services/tvmazeApi"
vi.mock("../../services/tvmazeApi")
type SearchShowsType = typeof tvmazeApi.searchShowsByName

function makeMockSearchResult(id: number, name: string): TvMazeSearchResult {
  return {
    score: 0.9,
    show: {
      id,
      name,
      genres: ["Drama"],
      rating: { average: 8.0 },
      summary: null,
      image: null,
      language: null,
      premiered: null,
      status: null,
      runtime: null,
    },
  }
}

describe("useShowSearchData", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("executeSearch", () => {
    it("returns search results limited to 10 shows", async () => {
      const mockResults = Array.from({ length: 15 }, (_, i) => makeMockSearchResult(i + 1, `Show ${i + 1}`))

      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockResolvedValue(mockResults)

      const result = await executeSearch("test")

      expect(result.shows).toHaveLength(10)
      expect(result.error).toBeNull()
    })

    it("returns empty array when no results match", async () => {
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockResolvedValue([])

      const result = await executeSearch("nonexistent")

      expect(result.shows).toEqual([])
      expect(result.error).toBeNull()
    })

    it("passes query and signal to searchShowsByName", async () => {
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockResolvedValue([])
      const mockSignal = new AbortController().signal

      await executeSearch("breaking bad", mockSignal)

      expect(tvmazeApi.searchShowsByName).toHaveBeenCalledWith("breaking bad", mockSignal)
    })

    it("returns error message on failure", async () => {
      const errorMessage = "Network error"
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockRejectedValue(new Error(errorMessage))

      const result = await executeSearch("test")

      expect(result.shows).toBeNull()
      expect(result.error).toBe(errorMessage)
    })

    it("returns null error on AbortError", async () => {
      const abortError = new DOMException("Aborted", "AbortError")
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockRejectedValue(abortError)

      const result = await executeSearch("test")

      expect(result.shows).toBeNull()
      expect(result.error).toBeNull()
    })

    it("returns generic error message for non-Error exceptions", async () => {
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockRejectedValue("Unknown error")

      const result = await executeSearch("test")

      expect(result.shows).toBeNull()
      expect(result.error).toBe("Failed to search shows.")
    })

    it("extracts show object from search results", async () => {
      const mockResults = [makeMockSearchResult(1, "Breaking Bad"), makeMockSearchResult(2, "Better Call Saul")]
      vi.mocked<SearchShowsType>(tvmazeApi.searchShowsByName).mockResolvedValue(mockResults)

      const result = await executeSearch("test")

      expect(result.shows).toEqual([
        {
          id: 1,
          name: "Breaking Bad",
          genres: ["Drama"],
          rating: { average: 8.0 },
          summary: null,
          image: null,
          language: null,
          premiered: null,
          status: null,
          runtime: null,
        },
        {
          id: 2,
          name: "Better Call Saul",
          genres: ["Drama"],
          rating: { average: 8.0 },
          summary: null,
          image: null,
          language: null,
          premiered: null,
          status: null,
          runtime: null,
        },
      ])
    })
  })

  describe("getSearchDebounceMs", () => {
    it("returns correct debounce delay", () => {
      const delay = getSearchDebounceMs()
      expect(delay).toBe(300)
    })
  })
})
