import { fetchShowsPage } from "../services/tvmazeApi"
import type { TvMazeShow } from "../types/tvmaze"
import { groupShowsByGenre, type GenreGroup } from "../utils/groupShowsByGenre"

const MAX_GENRES = 10
const SHOWS_PER_GENRE = 20

function hasShows(group: GenreGroup): boolean {
  return group.shows.length > 0
}

function limitShowsPerGroup(group: GenreGroup): GenreGroup {
  return { ...group, shows: group.shows.slice(0, SHOWS_PER_GENRE) }
}

function buildGenreGroups(shows: TvMazeShow[]): GenreGroup[] {
  const groupedByGenre = groupShowsByGenre(shows)
  const nonEmptyGroups = groupedByGenre.filter(hasShows)
  const topGenreGroups = nonEmptyGroups.slice(0, MAX_GENRES)

  return topGenreGroups.map(limitShowsPerGroup)
}

export interface DashboardShowsResult {
  genreGroups: GenreGroup[] | null
  error: string | null
}

export async function loadDashboardShows(cachedShows?: TvMazeShow[]): Promise<DashboardShowsResult> {
  try {
    const shows = cachedShows ?? (await fetchShowsPage(0))

    return {
      genreGroups: buildGenreGroups(shows),
      error: null,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load shows."
    return {
      genreGroups: null,
      error: message,
    }
  }
}
