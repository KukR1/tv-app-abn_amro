import { describe, expect, it } from "vitest"
import { useDashboardShows } from "../useDashboardShows"
import type { GenreGroup } from "../../utils/groupShowsByGenre"

describe("useDashboardShows", () => {
  it("initializes with default state", () => {
    const { isLoading, errorMessage, genreGroups } = useDashboardShows()

    expect(isLoading.value).toBe(false)
    expect(errorMessage.value).toBeNull()
    expect(genreGroups.value).toEqual([])
  })

  it("sets loading to true on startLoading", () => {
    const { isLoading, startLoading } = useDashboardShows()

    startLoading()

    expect(isLoading.value).toBe(true)
  })

  it("clears error when startLoading is called", () => {
    const { errorMessage, startLoading, setError } = useDashboardShows()

    setError("Some error")
    startLoading()

    expect(errorMessage.value).toBeNull()
  })

  it("sets loading to false on finishLoading", () => {
    const { isLoading, startLoading, finishLoading } = useDashboardShows()

    startLoading()
    finishLoading()

    expect(isLoading.value).toBe(false)
  })

  it("sets error message", () => {
    const { errorMessage, setError } = useDashboardShows()

    setError("Network error")

    expect(errorMessage.value).toBe("Network error")
  })

  it("clears error when setting null", () => {
    const { errorMessage, setError } = useDashboardShows()

    setError("Error")
    setError(null)

    expect(errorMessage.value).toBeNull()
  })

  it("sets genre groups", () => {
    const { genreGroups, setGroups } = useDashboardShows()
    const mockGroups: GenreGroup[] = [
      {
        genre: "Drama",
        shows: [
          {
            id: 1,
            name: "Breaking Bad",
            genres: ["Drama", "Crime"],
            rating: { average: 9.5 },
            summary: null,
            image: null,
            language: null,
            premiered: null,
            status: null,
            runtime: null,
          },
        ],
      },
    ]

    setGroups(mockGroups)

    expect(genreGroups.value).toEqual(mockGroups)
  })

  it("updates genre groups without affecting previous state", () => {
    const { genreGroups, setGroups } = useDashboardShows()
    const firstGroups: GenreGroup[] = [{ genre: "Drama", shows: [] }]
    const secondGroups: GenreGroup[] = [{ genre: "Comedy", shows: [] }]

    setGroups(firstGroups)
    expect(genreGroups.value).toEqual(firstGroups)

    setGroups(secondGroups)
    expect(genreGroups.value).toEqual(secondGroups)
  })

  it("maintains independent state across instances", () => {
    const instance1 = useDashboardShows()
    const instance2 = useDashboardShows()

    instance1.setError("Error in instance 1")
    instance1.startLoading()

    expect(instance2.errorMessage.value).toBeNull()
    expect(instance2.isLoading.value).toBe(false)
  })
})
