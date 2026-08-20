import { describe, expect, it } from "vitest"
import { useShowSearch } from "../useShowSearch"
import type { TvMazeShow } from "../../types/tvmaze"

function makeMockShow(id: number, name: string): TvMazeShow {
  return {
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
  }
}

describe("useShowSearch", () => {
  it("initializes with default state", () => {
    const { query, results, isSearching, errorMessage, trimmedQuery } = useShowSearch()

    expect(query.value).toBe("")
    expect(results.value).toEqual([])
    expect(isSearching.value).toBe(false)
    expect(errorMessage.value).toBeNull()
    expect(trimmedQuery.value).toBe("")
  })

  it("computes trimmed query correctly", () => {
    const { query, trimmedQuery } = useShowSearch()

    query.value = "  Breaking Bad  "

    expect(trimmedQuery.value).toBe("Breaking Bad")
  })

  it("handles whitespace-only query in trimmedQuery", () => {
    const { query, trimmedQuery } = useShowSearch()

    query.value = "   "

    expect(trimmedQuery.value).toBe("")
  })

  it("sets search results", () => {
    const { results, setResults } = useShowSearch()
    const shows = [makeMockShow(1, "Breaking Bad"), makeMockShow(2, "The Office")]

    setResults(shows)

    expect(results.value).toEqual(shows)
  })

  it("sets searching state", () => {
    const { isSearching, setSearching } = useShowSearch()

    setSearching(true)
    expect(isSearching.value).toBe(true)

    setSearching(false)
    expect(isSearching.value).toBe(false)
  })

  it("sets error message", () => {
    const { errorMessage, setErrorMessage } = useShowSearch()

    setErrorMessage("Search failed")

    expect(errorMessage.value).toBe("Search failed")
  })

  it("clears error when setting null", () => {
    const { errorMessage, setErrorMessage } = useShowSearch()

    setErrorMessage("Error")
    setErrorMessage(null)

    expect(errorMessage.value).toBeNull()
  })

  it("resets state to initial values", () => {
    const { results, errorMessage, isSearching, resetState, setResults, setErrorMessage, setSearching } = useShowSearch()

    setResults([makeMockShow(1, "Show")])
    setErrorMessage("Error")
    setSearching(true)

    resetState()

    expect(results.value).toEqual([])
    expect(errorMessage.value).toBeNull()
    expect(isSearching.value).toBe(false)
  })

  it("clears search and resets all state", () => {
    const { query, results, errorMessage, isSearching, clearSearch, setResults, setErrorMessage, setSearching } = useShowSearch()

    query.value = "Breaking Bad"
    setResults([makeMockShow(1, "Breaking Bad")])
    setErrorMessage("Some error")
    setSearching(true)

    clearSearch()

    expect(query.value).toBe("")
    expect(results.value).toEqual([])
    expect(errorMessage.value).toBeNull()
    expect(isSearching.value).toBe(false)
  })

  it("maintains independent state across instances", () => {
    const instance1 = useShowSearch()
    const instance2 = useShowSearch()

    instance1.query.value = "Breaking Bad"
    instance1.setSearching(true)

    expect(instance2.query.value).toBe("")
    expect(instance2.isSearching.value).toBe(false)
  })
})
