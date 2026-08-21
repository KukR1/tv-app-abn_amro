import { ref, computed } from "vue"

const STORAGE_KEY = "tv_watchlist"

const watchlistIds = ref<Set<number>>(new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")))

function persistToStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(watchlistIds.value)))
}

export function useWatchlist() {
  function toggleShow(showId: number): void {
    if (watchlistIds.value.has(showId)) {
      watchlistIds.value.delete(showId)
    } else {
      watchlistIds.value.add(showId)
    }
    watchlistIds.value = new Set(watchlistIds.value)
    persistToStorage()
  }

  function isInWatchlist(showId: number): boolean {
    return watchlistIds.value.has(showId)
  }

  const count = computed(() => watchlistIds.value.size)

  return { watchlistIds, toggleShow, isInWatchlist, count }
}
