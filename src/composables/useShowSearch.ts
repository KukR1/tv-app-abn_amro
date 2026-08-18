import { computed, ref } from "vue"
import type { TvMazeShow } from "../types/tvmaze"

export function useShowSearch() {
  const query = ref("")
  const results = ref<TvMazeShow[]>([])
  const isSearching = ref(false)
  const errorMessage = ref<string | null>(null)

  const trimmedQuery = computed(() => query.value.trim())

  function resetState(): void {
    results.value = []
    errorMessage.value = null
    isSearching.value = false
  }

  function clearSearch(): void {
    query.value = ""
    resetState()
  }

  function setResults(shows: TvMazeShow[]): void {
    results.value = shows
  }

  function setSearching(value: boolean): void {
    isSearching.value = value
  }

  function setErrorMessage(message: string | null): void {
    errorMessage.value = message
  }

  return {
    query,
    results,
    isSearching,
    errorMessage,
    trimmedQuery,
    resetState,
    clearSearch,
    setResults,
    setSearching,
    setErrorMessage,
  }
}
