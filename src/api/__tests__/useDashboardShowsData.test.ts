import { afterEach, describe, expect, it, vi } from "vitest"
import { loadDashboardShows, MAX_SHOWS_PER_GENRE } from "../useDashboardShowsData"
import * as tvmazeApi from "../../services/tvmazeApi"
vi.mock("../../services/tvmazeApi")

function makeMockShow(id: number, name: string, genres: string[] = ["Drama"]) {
  return {
    id,
    name,
    genres,
    rating: { average: 8.0 + ((id * 0.1) % 2) },
    summary: null,
    image: null,
    language: null,
    premiered: null,
    status: null,
    runtime: null,
  }
}

describe("useDashboardShowsData", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("loadDashboardShows", () => {
    it("returns grouped shows with no error on success", async () => {
      const mockShows = [makeMockShow(1, "Breaking Bad", ["Drama", "Crime"]), makeMockShow(2, "The Office", ["Comedy"]), makeMockShow(3, "Dexter", ["Drama", "Crime"])]
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      expect(result.sourceShows).toEqual(mockShows)
      expect(result.genreGroups).not.toBeNull()
      expect(result.genreGroups).toHaveLength(3)
      expect(result.error).toBeNull()
    })

    it("uses cached shows when provided", async () => {
      const cachedShows = [makeMockShow(1, "Cached Show")]
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue([])

      await loadDashboardShows(cachedShows)

      expect(tvmazeApi.fetchShowsPage).not.toHaveBeenCalled()
    })

    it("fetches shows when cache is not provided", async () => {
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue([makeMockShow(1, "Show")])

      await loadDashboardShows()

      expect(tvmazeApi.fetchShowsPage).toHaveBeenCalled()
    })

    it("limits genre groups to max 10", async () => {
      const mockShows = Array.from({ length: 100 }, (_, i) => makeMockShow(i + 1, `Show ${i + 1}`, [`Genre${(i % 15).toString()}`]))
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      expect(result.genreGroups?.length).toBeLessThanOrEqual(10)
    })

    it("limits shows per genre to max 25", async () => {
      const mockShows = Array.from({ length: 100 }, (_, i) => makeMockShow(i + 1, `Show ${i + 1}`, ["Drama"]))
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      result.genreGroups?.forEach((group) => {
        expect(group.shows.length).toBeLessThanOrEqual(MAX_SHOWS_PER_GENRE)
      })
      expect(result.genreGroups?.length).toBeGreaterThan(0)
    })

    it("filters out genres with no shows", async () => {
      const mockShows = [makeMockShow(1, "Breaking Bad", ["Drama", "Crime"])]
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      const hasEmptyGenres = result.genreGroups?.some((g) => g.shows.length === 0)
      expect(hasEmptyGenres).toBe(false)
    })

    it("returns error message on API failure", async () => {
      const errorMessage = "Network error"
      vi.mocked(tvmazeApi.fetchShowsPage).mockRejectedValue(new Error(errorMessage))

      const result = await loadDashboardShows()

      expect(result.sourceShows).toBeNull()
      expect(result.genreGroups).toBeNull()
      expect(result.error).toBe(errorMessage)
    })

    it("returns generic error for non-Error exceptions", async () => {
      vi.mocked(tvmazeApi.fetchShowsPage).mockRejectedValue("Unknown error")

      const result = await loadDashboardShows()

      expect(result.sourceShows).toBeNull()
      expect(result.genreGroups).toBeNull()
      expect(result.error).toBe("Failed to load shows.")
    })

    it("groups shows by all their genres", async () => {
      const mockShows = [makeMockShow(1, "Breaking Bad", ["Drama", "Crime"]), makeMockShow(2, "Crime Show", ["Crime"])]
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      expect(result.genreGroups).toBeDefined()
      expect(result.genreGroups?.length).toBeGreaterThan(1)

      const show1InGroups = result.genreGroups!.filter((g) => g.shows.some((s) => s.id === 1))
      expect(show1InGroups.length).toBeGreaterThan(0)
    })

    it("returns sourceShows matching fetched shows", async () => {
      const mockShows = [makeMockShow(1, "Show 1"), makeMockShow(2, "Show 2"), makeMockShow(3, "Show 3")]
      vi.mocked(tvmazeApi.fetchShowsPage).mockResolvedValue(mockShows)

      const result = await loadDashboardShows()

      expect(result.sourceShows).toEqual(mockShows)
    })
  })
})
