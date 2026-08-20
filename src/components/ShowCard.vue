<script setup lang="ts">
import { computed, ref } from "vue"
import type { TvMazeShow } from "../types/tvmaze"
import { formatRating } from "../utils/showFormatters"

const props = defineProps<{
  show: TvMazeShow
}>()

const showRating = computed(() => formatRating(props.show.rating.average))
const showMediumImage = computed(() => props.show.image?.medium ?? "https://placehold.co/280x400/1e293b/e2e8f0?text=No+Image")
const showOriginalImage = computed(() => props.show.image?.original ?? showMediumImage.value)
const showGenres = computed(() => props.show.genres.slice(0, 2).join(" • ") || "Unknown genre")
const showGenreChips = computed(() => props.show.genres.slice(0, 3))
const showMeta = computed(() => {
  if (props.show.runtime) {
    return `${props.show.runtime} min`
  }

  return props.show.premiered ?? "Unknown year"
})

const highResRequested = ref(false)
const highResLoaded = ref(false)
const highResFailed = ref(false)

const showImage = computed(() => {
  if (highResRequested.value && highResLoaded.value && !highResFailed.value) {
    return showOriginalImage.value
  }

  return showMediumImage.value
})

function requestHighResImage(): void {
  if (highResRequested.value || !props.show.image?.original) {
    return
  }

  highResRequested.value = true

  const img = new Image()
  img.onload = () => {
    highResLoaded.value = true
  }
  img.onerror = () => {
    highResFailed.value = true
  }
  img.src = props.show.image.original
}
</script>

<template>
  <article
    class="group relative w-36 min-w-36 overflow-hidden rounded-xl border border-green-700 bg-green-950 transition duration-200 hover:border-green-500 hover:shadow-[0_10px_30px_rgba(0,120,107,0.4)] sm:w-40 sm:min-w-40 md:w-48 md:min-w-48"
    @mouseenter="requestHighResImage"
    @focusin="requestHighResImage"
  >
    <img
      :src="showImage"
      :alt="show.name"
      loading="lazy"
      class="block h-52 w-full object-cover object-center transition duration-300 group-hover:scale-105 group-focus-within:scale-105 sm:h-56 md:h-64"
    />

    <div class="absolute inset-0 bg-linear-to-t from-green-950/80 via-green-950/30 to-transparent opacity-80" />

    <div class="absolute inset-x-0 bottom-0 p-3 transition duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
      <h4 class="m-0 truncate text-sm font-semibold text-white">{{ show.name }}</h4>
      <p class="mt-1 text-xs text-green-100">{{ showGenres }}</p>
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 rounded-t-lg bg-green-950/75 p-3 opacity-0 backdrop-blur-[1px] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
    >
      <div class="w-full space-y-2 text-xs text-green-100">
        <div class="flex items-center justify-between gap-2">
          <p class="min-w-0 truncate pr-1 text-sm font-semibold text-white">{{ show.name }}</p>
          <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green-600 bg-green-800/80 text-yellow-300" aria-hidden="true"> ▶ </span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <span v-for="genre in showGenreChips" :key="genre" class="rounded-full border border-green-600 bg-green-800/80 px-2 py-0.5 text-[10px] text-green-50 truncate">
            {{ genre }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <p>⭐ {{ showRating }}</p>
          <p>{{ showMeta }}</p>
        </div>
      </div>
    </div>
  </article>
</template>
