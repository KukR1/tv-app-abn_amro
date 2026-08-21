<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { loadShowDetailsById } from "../api/useShowDetailsData"
import { useWatchlist } from "../composables/useWatchlist"
import type { TvMazeShow } from "../types/tvmaze"
import { formatRating, formatValue, stripHtmlTags } from "../utils/showFormatters"

const route = useRoute()
const showId = computed(() => Number(route.params["id"]))

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const show = ref<TvMazeShow | null>(null)
const imageLoaded = ref(false)

const { isInWatchlist, toggleShow } = useWatchlist()

const summary = computed(() => stripHtmlTags(show.value?.summary ?? null))
const showImage = computed(() => show.value?.image?.original ?? "https://placehold.co/500x720/1e293b/e2e8f0?text=No+Image")
const genreList = computed(() => show.value?.genres.join(", ") || "Unknown")

async function loadShow(id: number): Promise<void> {
  isLoading.value = true
  imageLoaded.value = false
  const result = await loadShowDetailsById(id)
  show.value = result.show
  errorMessage.value = result.errorMessage
  isLoading.value = false
}

function handleImageLoad(): void {
  imageLoaded.value = true
}

void loadShow(showId.value)

watch(showId, (id) => {
  void loadShow(id)
})
</script>

<template>
  <section class="grid gap-4">
    <RouterLink to="/" class="w-fit text-neutral-300 no-underline transition hover:text-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500">
      ← Back to dashboard
    </RouterLink>

    <p v-if="isLoading" class="text-neutral-400">Loading show details...</p>
    <p v-else-if="errorMessage" class="text-red-300">{{ errorMessage }}</p>

    <article v-else-if="show" class="grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-[minmax(220px,320px)_minmax(0,1fr)] md:items-start">
      <div class="relative w-full max-w-80 overflow-hidden rounded-lg" style="aspect-ratio: 9/13">
        <div v-if="!imageLoaded" class="absolute inset-0 bg-neutral-700 animate-pulse" />
        <img :src="showImage" :alt="show.name" class="h-full w-full object-cover transition-opacity duration-500" :class="imageLoaded ? 'opacity-100' : 'opacity-0'" @load="handleImageLoad" />
      </div>

      <div>
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h2 class="m-0 text-[clamp(1.4rem,2vw+0.8rem,2rem)] font-semibold text-white">{{ show.name }}</h2>
            <p class="text-neutral-300">⭐ {{ formatRating(show.rating.average) }} · {{ formatValue(show.language) }} · {{ genreList }}</p>
          </div>
          <button @click="toggleShow(show.id)" class="mt-1 text-3xl hover:scale-125 cursor-pointer transition" :aria-label="isInWatchlist(show.id) ? 'Remove from watchlist' : 'Add to watchlist'">
            {{ isInWatchlist(show.id) ? "★" : "☆" }}
          </button>
        </div>

        <dl class="my-3 grid gap-2.5 md:grid-cols-3">
          <div class="rounded-lg border border-neutral-700 bg-neutral-900/30 p-2.5">
            <dt class="text-xs text-neutral-400">Status</dt>
            <dd class="mt-1 text-neutral-200">{{ formatValue(show.status) }}</dd>
          </div>
          <div class="rounded-lg border border-neutral-700 bg-neutral-900/30 p-2.5">
            <dt class="text-xs text-neutral-400">Premiered</dt>
            <dd class="mt-1 text-neutral-200">{{ formatValue(show.premiered) }}</dd>
          </div>
          <div class="rounded-lg border border-neutral-700 bg-neutral-900/30 p-2.5">
            <dt class="text-xs text-neutral-400">Runtime</dt>
            <dd class="mt-1 text-neutral-200">{{ show.runtime ? `${show.runtime} min` : "Unknown" }}</dd>
          </div>
        </dl>

        <p class="text-neutral-200">{{ summary || "No summary available." }}</p>
      </div>
    </article>
  </section>
</template>
