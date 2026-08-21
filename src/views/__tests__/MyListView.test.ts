import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import MyListView from "../MyListView.vue"
import * as useDashboardShowsDataModule from "../../api/useDashboardShowsData"
import * as useWatchlistModule from "../../composables/useWatchlist"
import * as useShowsCacheModule from "../../composables/useShowsCache"
import type { TvMazeShow } from "../../types/tvmaze"

vi.mock("../../api/useDashboardShowsData")
vi.mock("../../composables/useWatchlist")
vi.mock("../../composables/useShowsCache")

const mockShows: TvMazeShow[] = [
  {
    id: 1,
    name: "Breaking Bad",
    genres: ["Drama"],
    rating: { average: 9.5 },
    image: { medium: "image1.jpg", original: "image1.jpg" },
    summary: "A chemistry teacher...",
    premiered: "2008-01-20",
    status: "Ended",
    runtime: 47,
    language: "English",
  },
  {
    id: 2,
    name: "The Office",
    genres: ["Comedy"],
    rating: { average: 9.0 },
    image: { medium: "image2.jpg", original: "image2.jpg" },
    summary: "A mockumentary...",
    premiered: "2005-03-24",
    status: "Ended",
    runtime: 22,
    language: "English",
  },
]

describe("MyListView", () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    vi.clearAllMocks()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/my-list", component: MyListView },
        { path: "/", component: { template: "<div>Dashboard</div>" } },
      ],
    })
  })

  it("should mount the component", () => {
    vi.mocked(useWatchlistModule.useWatchlist).mockReturnValue({
      watchlistIds: { value: new Set([1]) },
      toggleShow: vi.fn(),
      isInWatchlist: vi.fn(() => true),
      count: { value: 1 },
    })

    vi.mocked(useShowsCacheModule.useShowsCache).mockReturnValue({
      getCache: vi.fn(() => mockShows),
      setCache: vi.fn(),
      clearCache: vi.fn(),
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      sourceShows: mockShows,
      genreGroups: [],
      error: null,
    })

    const wrapper = mount(MyListView, { global: { plugins: [router] } })
    expect(wrapper.exists()).toBe(true)
  })

  it("should display loading state when cache is empty", async () => {
    vi.mocked(useWatchlistModule.useWatchlist).mockReturnValue({
      watchlistIds: { value: new Set() },
      toggleShow: vi.fn(),
      isInWatchlist: vi.fn(() => false),
      count: { value: 0 },
    })

    vi.mocked(useShowsCacheModule.useShowsCache).mockReturnValue({
      getCache: vi.fn(() => null),
      setCache: vi.fn(),
      clearCache: vi.fn(),
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      sourceShows: mockShows,
      genreGroups: [],
      error: null,
    })

    const wrapper = mount(MyListView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain("Loading your watchlist")
  })

  it("should display empty state when no favorites", async () => {
    vi.mocked(useWatchlistModule.useWatchlist).mockReturnValue({
      watchlistIds: { value: new Set() },
      toggleShow: vi.fn(),
      isInWatchlist: vi.fn(() => false),
      count: { value: 0 },
    })

    vi.mocked(useShowsCacheModule.useShowsCache).mockReturnValue({
      getCache: vi.fn(() => mockShows),
      setCache: vi.fn(),
      clearCache: vi.fn(),
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      sourceShows: mockShows,
      genreGroups: [],
      error: null,
    })

    const wrapper = mount(MyListView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain("No favorites yet!")
  })

  it("should display favorites when watchlist has items", async () => {
    vi.mocked(useWatchlistModule.useWatchlist).mockReturnValue({
      watchlistIds: { value: new Set([1]) },
      toggleShow: vi.fn(),
      isInWatchlist: vi.fn((id) => id === 1),
      count: { value: 1 },
    })

    vi.mocked(useShowsCacheModule.useShowsCache).mockReturnValue({
      getCache: vi.fn(() => mockShows),
      setCache: vi.fn(),
      clearCache: vi.fn(),
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      sourceShows: mockShows,
      genreGroups: [],
      error: null,
    })

    const wrapper = mount(MyListView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain("My Watchlist (1)")
    expect(wrapper.text()).toContain("Breaking Bad")
  })

  it("should have back link to dashboard", () => {
    vi.mocked(useWatchlistModule.useWatchlist).mockReturnValue({
      watchlistIds: { value: new Set() },
      toggleShow: vi.fn(),
      isInWatchlist: vi.fn(() => false),
      count: { value: 0 },
    })

    vi.mocked(useShowsCacheModule.useShowsCache).mockReturnValue({
      getCache: vi.fn(() => mockShows),
      setCache: vi.fn(),
      clearCache: vi.fn(),
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      sourceShows: mockShows,
      genreGroups: [],
      error: null,
    })

    const wrapper = mount(MyListView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain("← Back to dashboard")
  })
})
