import { ref } from "vue"
import type { GenreGroup } from "../utils/groupShowsByGenre"

export function useDashboardShows() {
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const genreGroups = ref<GenreGroup[]>([])

  function startLoading(): void {
    isLoading.value = true
    errorMessage.value = null
  }

  function finishLoading(): void {
    isLoading.value = false
  }

  function setError(message: string | null): void {
    errorMessage.value = message
  }

  function setGroups(groups: GenreGroup[]): void {
    genreGroups.value = groups
  }

  return {
    isLoading,
    errorMessage,
    genreGroups,
    startLoading,
    finishLoading,
    setError,
    setGroups,
  }
}
