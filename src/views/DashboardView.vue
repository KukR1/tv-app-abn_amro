<script setup lang="ts">
import { computed, ref, watch } from "vue"
import ShowCarouselRow from "../components/ShowCarouselRow.vue"
import ShowSearchSection from "../components/ShowSearchSection.vue"
import { loadDashboardShows } from "../api/useDashboardShowsData"
import { executeSearch, getSearchDebounceMs } from "../api/useShowSearchData"
import { useShowSearch } from "../composables/useShowSearch"
import { useShowsCache } from "../composables/useShowsCache"
import type { GenreGroup } from "../utils/groupShowsByGenre"

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const genreGroups = ref<GenreGroup[]>([])

const {
  query: searchQuery,
  results: searchResults,
  isSearching,
  errorMessage: searchErrorMessage,
  trimmedQuery: trimmedSearchQuery,
  resetState: resetSearchState,
  setResults,
  setSearching,
  setErrorMessage,
  clearSearch,
} = useShowSearch()

const { getCache, setCache } = useShowsCache()

const isSearchFocusMode = computed(() => trimmedSearchQuery.value.length > 0)

function clearActiveSearch(): void {
  clearSearch()
}

async function loadShows(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null

  try {
    const cached = getCache()
    console.log("Loading shows, cached:", cached)
    const result = await loadDashboardShows(cached ?? undefined)
    console.log("Result:", result)

    if (result.genreGroups) {
      if (!cached && result.sourceShows) {
        setCache(result.sourceShows)
      }
      genreGroups.value = result.genreGroups
      console.log("Loaded genres:", genreGroups.value.length)
    }
    if (result.error) {
      errorMessage.value = result.error
      console.error("Error loading shows:", result.error)
    }
  } catch (error) {
    console.error("Exception loading shows:", error)
    errorMessage.value = error instanceof Error ? error.message : "Unknown error"
  }

  isLoading.value = false
}

void loadShows()

watch(trimmedSearchQuery, (query, _previousQuery, onCleanup) => {
  if (!query) {
    resetSearchState()
    return
  }

  setSearching(true)
  setErrorMessage(null)

  const abortController = new AbortController()
  const timeoutId = setTimeout(async () => {
    const result = await executeSearch(query, abortController.signal)
    if (result.shows) {
      setResults(result.shows)
    }
    if (result.error) {
      setErrorMessage(result.error)
      setResults([])
    }
    if (!abortController.signal.aborted) {
      setSearching(false)
    }
  }, getSearchDebounceMs())

  onCleanup(() => {
    clearTimeout(timeoutId)
    abortController.abort()
  })
})
</script>

<template>
  <section class="relative flex flex-col gap-4">
    <button v-if="isSearchFocusMode" type="button" aria-label="Close search" class="fixed inset-0 z-10 cursor-default bg-slate-950/20 backdrop-blur-[1px]" @click="clearActiveSearch" />

    <div class="relative z-20">
      <ShowSearchSection
        :query="searchQuery"
        :results="searchResults"
        :is-searching="isSearching"
        :error-message="searchErrorMessage"
        :is-active="isSearchFocusMode"
        @update:query="searchQuery = $event"
      />
    </div>

    <div class="transition duration-900" :class="isSearchFocusMode ? 'pointer-events-none select-none opacity-25 blur-[3px] saturate-50' : 'opacity-100 blur-0'">
      <p v-if="isLoading" class="text-slate-300">Loading shows...</p>
      <p v-else-if="errorMessage" class="text-red-200">{{ errorMessage }}</p>

      <div v-else class="grid gap-5">
        <section v-for="group in genreGroups" :key="group.genre" class="grid gap-2.5">
          <h2 class="m-0 text-xl font-semibold text-slate-100">{{ group.genre }}</h2>
          <ShowCarouselRow :shows="group.shows" />
        </section>
      </div>
    </div>
  </section>
</template>
