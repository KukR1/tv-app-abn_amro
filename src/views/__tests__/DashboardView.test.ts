import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import DashboardView from "../DashboardView.vue"
import * as useDashboardShowsDataModule from "../../api/useDashboardShowsData"
import type { TvMazeShow } from "../../types/tvmaze"

vi.mock("../../api/useDashboardShowsData")

const mockShows: TvMazeShow[] = [
  {
    id: 1,
    name: "Breaking Bad",
    genres: ["Drama", "Crime"],
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

describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("mounts and loads shows on initial load", async () => {
    const loadDashboardShowsMock = vi.fn().mockResolvedValue({
      genreGroups: [
        {
          genre: "Drama",
          shows: [mockShows[0]],
        },
      ],
      sourceShows: [mockShows[0]],
      errorMessage: null,
    })

    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockImplementation(loadDashboardShowsMock)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router],
        stubs: {
          ShowSearchSection: true,
          ShowCarouselRow: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(loadDashboardShowsMock).toHaveBeenCalled()
  })

  it("displays loading state initially", async () => {
    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockImplementation(() => new Promise(() => {}))

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router],
        stubs: {
          ShowSearchSection: true,
          ShowCarouselRow: true,
        },
      },
    })

    expect(wrapper.text()).toContain("Loading shows...")
  })

  it("renders genre groups when data loads successfully", async () => {
    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      genreGroups: [
        {
          genre: "Drama",
          shows: [mockShows[0]],
        },
        {
          genre: "Comedy",
          shows: [mockShows[1]],
        },
      ],
      sourceShows: mockShows,
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router],
        stubs: {
          ShowSearchSection: true,
          ShowCarouselRow: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain("Drama")
    expect(wrapper.text()).toContain("Comedy")
  })

  it("applies blur effect when search is focused", async () => {
    vi.mocked(useDashboardShowsDataModule.loadDashboardShows).mockResolvedValue({
      genreGroups: [
        {
          genre: "Drama",
          shows: [mockShows[0]],
        },
      ],
      sourceShows: [mockShows[0]],
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [router],
        stubs: {
          ShowSearchSection: true,
          ShowCarouselRow: true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    const vm = wrapper.vm
    vm.searchQuery = "Breaking"
    await wrapper.vm.$nextTick()

    const contentDiv = wrapper.find(".opacity-25")
    expect(contentDiv.exists()).toBe(true)
  })
})
