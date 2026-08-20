import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import ShowDetailView from "../ShowDetailView.vue"
import * as useShowDetailsDataModule from "../../api/useShowDetailsData"
import type { TvMazeShow } from "../../types/tvmaze"

vi.mock("../../api/useShowDetailsData")

const mockShow: TvMazeShow = {
  id: 1,
  name: "Breaking Bad",
  genres: ["Drama", "Crime"],
  rating: { average: 9.5 },
  image: { medium: "image.jpg", original: "image-large.jpg" },
  summary: "A high school chemistry teacher diagnosed with inoperable lung cancer...",
  premiered: "2008-01-20",
  status: "Ended",
  runtime: 47,
  language: "English",
}

describe("ShowDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("loads show details on mount", async () => {
    const loadShowDetailsByIdMock = vi.fn().mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockImplementation(loadShowDetailsByIdMock)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()
    expect(loadShowDetailsByIdMock).toHaveBeenCalledWith(1)
  })

  it("displays loading state initially", async () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockImplementation(() => new Promise(() => {}))

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain("Loading show details...")
  })

  it("displays error message when show not found", async () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockResolvedValue({
      show: null,
      errorMessage: "Show not found",
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/999")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain("Show not found")
  })

  it("displays show details when loaded successfully", async () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain("Breaking Bad")
    expect(wrapper.text()).toContain("9.5")
    expect(wrapper.text()).toContain("Ended")
    expect(wrapper.text()).toContain("Drama")
    expect(wrapper.text()).toContain("Crime")
  })

  it("renders back to dashboard link", async () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    const backLink = wrapper.find("a")
    expect(backLink.exists()).toBe(true)
    expect(backLink.text()).toContain("Back to dashboard")
  })

  it("initializes image as not loaded", () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.vm.imageLoaded).toBe(false)
  })

  it("updates imageLoaded state when image loads", async () => {
    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.vm.imageLoaded).toBe(false)
    wrapper.vm.handleImageLoad()
    expect(wrapper.vm.imageLoaded).toBe(true)
  })

  it("reloads show when route id changes", async () => {
    const loadShowDetailsByIdMock = vi.fn().mockResolvedValue({
      show: mockShow,
      errorMessage: null,
    })

    vi.mocked(useShowDetailsDataModule.loadShowDetailsById).mockImplementation(loadShowDetailsByIdMock)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/shows/:id",
          name: "show-details",
          component: { template: "<div>Details</div>" },
        },
        {
          path: "/",
          name: "dashboard",
          component: { template: "<div>Dashboard</div>" },
        },
      ],
    })

    await router.push("/shows/1")

    const wrapper = mount(ShowDetailView, {
      global: {
        plugins: [router],
      },
    })

    await wrapper.vm.$nextTick()
    const initialCallCount = loadShowDetailsByIdMock.mock.calls.length

    await router.push("/shows/2")
    await wrapper.vm.$nextTick()

    expect(loadShowDetailsByIdMock.mock.calls.length).toBeGreaterThan(initialCallCount)
  })
})
