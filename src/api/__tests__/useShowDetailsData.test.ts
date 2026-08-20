import { afterEach, describe, expect, it, vi } from "vitest"
import { loadShowDetailsById } from "../useShowDetailsData"
import * as tvmazeApi from "../../services/tvmazeApi"
vi.mock("../../services/tvmazeApi")

function makeMockShow(id: number, name: string) {
  return {
    id,
    name,
    genres: ["Drama"],
    rating: { average: 8.5 },
    summary: "<p>Show summary</p>",
    image: { medium: "url", original: "url" },
    language: "English",
    premiered: "2008-01-20",
    status: "Ended",
    runtime: 47,
  }
}

describe("useShowDetailsData", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("loadShowDetailsById", () => {
    it("returns show details on success", async () => {
      const mockShow = makeMockShow(1, "Breaking Bad")
      vi.mocked(tvmazeApi.fetchShowById).mockResolvedValue(mockShow)

      const result = await loadShowDetailsById(1)

      expect(result.show).toEqual(mockShow)
      expect(result.errorMessage).toBeNull()
    })

    it("fetches show by correct ID", async () => {
      vi.mocked(tvmazeApi.fetchShowById).mockResolvedValue(makeMockShow(42, "Show"))

      await loadShowDetailsById(42)

      expect(tvmazeApi.fetchShowById).toHaveBeenCalledWith(42)
    })

    it("returns error for invalid show ID (0)", async () => {
      const result = await loadShowDetailsById(0)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe("Invalid show id.")
      expect(tvmazeApi.fetchShowById).not.toHaveBeenCalled()
    })

    it("returns error for negative show ID", async () => {
      const result = await loadShowDetailsById(-5)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe("Invalid show id.")
      expect(tvmazeApi.fetchShowById).not.toHaveBeenCalled()
    })

    it("returns error for non-finite show ID", async () => {
      const result = await loadShowDetailsById(NaN)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe("Invalid show id.")
      expect(tvmazeApi.fetchShowById).not.toHaveBeenCalled()
    })

    it("returns error for Infinity", async () => {
      const result = await loadShowDetailsById(Infinity)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe("Invalid show id.")
    })

    it("returns error message on API failure", async () => {
      const errorMessage = "Show not found"
      vi.mocked(tvmazeApi.fetchShowById).mockRejectedValue(new Error(errorMessage))

      const result = await loadShowDetailsById(999)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe(errorMessage)
    })

    it("returns generic error for non-Error exceptions", async () => {
      vi.mocked(tvmazeApi.fetchShowById).mockRejectedValue("Unknown error")

      const result = await loadShowDetailsById(1)

      expect(result.show).toBeNull()
      expect(result.errorMessage).toBe("Failed to load show details.")
    })
  })
})
