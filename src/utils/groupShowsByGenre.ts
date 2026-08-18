import type { TvMazeShow } from "../types/tvmaze"

export interface GenreGroup {
  genre: string
  shows: TvMazeShow[]
}

function compareShowsByRatingAndName(a: TvMazeShow, b: TvMazeShow): number {
  const ratingDiff = (b.rating.average ?? -1) - (a.rating.average ?? -1)
  return ratingDiff !== 0 ? ratingDiff : a.name.localeCompare(b.name)
}

function addShowToGenreGroup(showsByGenre: Map<string, TvMazeShow[]>, genre: string, show: TvMazeShow): void {
  const group = showsByGenre.get(genre)
  if (group) {
    group.push(show)
    return
  }

  showsByGenre.set(genre, [show])
}

function compareGenreGroupsBySize(a: GenreGroup, b: GenreGroup): number {
  return b.shows.length - a.shows.length
}

export function groupShowsByGenre(shows: TvMazeShow[]): GenreGroup[] {
  const showsByGenre = new Map<string, TvMazeShow[]>()

  for (const show of shows) {
    for (const genre of show.genres) {
      addShowToGenreGroup(showsByGenre, genre, show)
    }
  }

  return Array.from(showsByGenre, ([genre, groupShows]) => ({
    genre,
    shows: [...groupShows].sort(compareShowsByRatingAndName),
  })).sort(compareGenreGroupsBySize)
}
