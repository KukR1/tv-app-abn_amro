import type { TvMazeSearchResult, TvMazeShow } from "../types/tvmaze"

const TV_MAZE_BASE_URL = "https://api.tvmaze.com"

async function fetchFromTvMaze<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${TV_MAZE_BASE_URL}${path}`, { signal })

  if (!response.ok) {
    throw new Error(`TVMaze request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchShowsPage(page = 0): Promise<TvMazeShow[]> {
  return fetchFromTvMaze<TvMazeShow[]>(`/shows?page=${page}`)
}

export async function searchShowsByName(query: string, signal?: AbortSignal): Promise<TvMazeSearchResult[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  return fetchFromTvMaze<TvMazeSearchResult[]>(`/search/shows?q=${encodeURIComponent(trimmedQuery)}`, signal)
}

export async function fetchShowById(showId: number): Promise<TvMazeShow> {
  return fetchFromTvMaze<TvMazeShow>(`/shows/${showId}`)
}
