import { fetchShowById } from "../services/tvmazeApi"
import type { TvMazeShow } from "../types/tvmaze"

export async function loadShowDetailsById(
  showId: number,
): Promise<{ show: TvMazeShow | null; errorMessage: string | null }> {
  if (!Number.isFinite(showId) || showId <= 0) {
    return { show: null, errorMessage: "Invalid show id." }
  }

  try {
    const show = await fetchShowById(showId)
    return { show, errorMessage: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load show details."
    return { show: null, errorMessage: message }
  }
}
