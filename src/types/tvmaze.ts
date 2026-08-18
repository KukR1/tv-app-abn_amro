export interface TvMazeImage {
  medium: string | null
  original: string | null
}

export interface TvMazeRating {
  average: number | null
}

export interface TvMazeShow {
  id: number
  name: string
  genres: string[]
  rating: TvMazeRating
  summary: string | null
  image: TvMazeImage | null
  language: string | null
  premiered: string | null
  status: string | null
  runtime: number | null
}

export interface TvMazeSearchResult {
  score: number
  show: TvMazeShow
}
