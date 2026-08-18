import { searchShowsByName } from "../services/tvmazeApi"
import type { TvMazeShow } from "../types/tvmaze"

const SEARCH_DEBOUNCE_MS = 300
const SEARCH_RESULTS_LIMIT = 10

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

export interface SearchResult {
  shows: TvMazeShow[] | null
  error: string | null
}

export async function executeSearch(query: string, signal?: AbortSignal): Promise<SearchResult> {
  try {
    const results = await searchShowsByName(query, signal)
    return {
      shows: results.map((r) => r.show).slice(0, SEARCH_RESULTS_LIMIT),
      error: null,
    }
  } catch (error) {
    if (isAbortError(error)) {
      return { shows: null, error: null }
    }

    const message = error instanceof Error ? error.message : "Failed to search shows."
    return { shows: null, error: message }
  }
}

export function getSearchDebounceMs(): number {
  return SEARCH_DEBOUNCE_MS
}
