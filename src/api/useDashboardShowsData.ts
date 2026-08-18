import { fetchShowsPage } from "../services/tvmazeApi"
import type { TvMazeShow } from "../types/tvmaze"
import { groupShowsByGenre, type GenreGroup } from "../utils/groupShowsByGenre"

export interface DashboardShowsResult {
  sourceShows: TvMazeShow[] | null
  genreGroups: GenreGroup[] | null
  error: string | null
}

const MAX_GENRES = 10

function hasShows(group: GenreGroup): boolean {
  return group.shows.length > 0
}

function buildGenreGroups(shows: TvMazeShow[]): GenreGroup[] {
  const groupedByGenre = groupShowsByGenre(shows)
  const nonEmptyGroups = groupedByGenre.filter(hasShows)
  return nonEmptyGroups.slice(0, MAX_GENRES)
}

export async function loadDashboardShows(cachedShows?: TvMazeShow[]): Promise<DashboardShowsResult> {
  try {
    const shows = cachedShows ?? (await fetchShowsPage(0))

    return {
      sourceShows: shows,
      genreGroups: buildGenreGroups(shows),
      error: null,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load shows."
    return {
      sourceShows: null,
      genreGroups: null,
      error: message,
    }
  }
}
