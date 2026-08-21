import { describe, it, expect, beforeEach, vi } from "vitest"
import { useWatchlist } from "../useWatchlist"

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

vi.stubGlobal("localStorage", localStorageMock)

describe("useWatchlist", () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it("should have watchlistIds ref", () => {
    const { watchlistIds } = useWatchlist()
    expect(watchlistIds).toBeDefined()
    expect(watchlistIds.value instanceof Set).toBe(true)
  })

  it("should have toggleShow function", () => {
    const { toggleShow } = useWatchlist()
    expect(typeof toggleShow).toBe("function")
  })

  it("should have isInWatchlist function", () => {
    const { isInWatchlist } = useWatchlist()
    expect(typeof isInWatchlist).toBe("function")
  })

  it("should have count computed property", () => {
    const { count } = useWatchlist()
    expect(count).toBeDefined()
    expect(typeof count.value).toBe("number")
  })

  it("should toggle show to watchlist", () => {
    const { toggleShow, isInWatchlist } = useWatchlist()
    const showId = 999

    expect(isInWatchlist(showId)).toBe(false)
    toggleShow(showId)
    expect(isInWatchlist(showId)).toBe(true)
  })
})
