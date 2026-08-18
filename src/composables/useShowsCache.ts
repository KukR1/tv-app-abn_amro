import { ref } from "vue"

import type { TvMazeShow } from "../types/tvmaze"

const cachedShows = ref<TvMazeShow[] | null>(null)

export function useShowsCache() {
  function getCache(): TvMazeShow[] | null {
    return cachedShows.value
  }

  function setCache(shows: TvMazeShow[]): void {
    cachedShows.value = shows
  }

  function clearCache(): void {
    cachedShows.value = null
  }

  return { getCache, setCache, clearCache }
}
