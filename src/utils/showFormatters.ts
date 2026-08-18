export function formatRating(rating: number | null): string {
  if (rating === null) {
    return "N/A"
  }

  return rating.toFixed(1)
}

export function stripHtmlTags(text: string | null): string {
  if (!text) {
    return ""
  }

  return text.replace(/<[^>]*>/g, "").trim()
}

export function formatValue(value: string | number | null): string {
  if (value === null || value === "") {
    return "Unknown"
  }

  return String(value)
}
