<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { loadShowDetailsById } from "../api/useShowDetailsData"
import type { TvMazeShow } from "../types/tvmaze"
import { formatRating, formatValue, stripHtmlTags } from "../utils/showFormatters"

const route = useRoute()
const showId = computed(() => Number(route.params["id"]))

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const show = ref<TvMazeShow | null>(null)

const summary = computed(() => stripHtmlTags(show.value?.summary ?? null))
const showImage = computed(() => show.value?.image?.original ?? "https://placehold.co/500x720/1e293b/e2e8f0?text=No+Image")
const genreList = computed(() => show.value?.genres.join(", ") || "Unknown")

async function loadShow(id: number): Promise<void> {
  isLoading.value = true
  const result = await loadShowDetailsById(id)
  show.value = result.show
  errorMessage.value = result.errorMessage
  isLoading.value = false
}

void loadShow(showId.value)

watch(showId, (id) => {
  void loadShow(id)
})
</script>

<template>
  <section class="grid gap-4">
    <RouterLink to="/" class="w-fit text-sky-200 no-underline transition hover:text-sky-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
      ← Back to dashboard
    </RouterLink>

    <p v-if="isLoading" class="text-slate-300">Loading show details...</p>
    <p v-else-if="errorMessage" class="text-red-200">{{ errorMessage }}</p>

    <article v-else-if="show" class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(220px,320px)_minmax(0,1fr)] md:items-start">
      <img :src="showImage" :alt="show.name" class="w-full max-w-80 rounded-xl border border-slate-700" />

      <div>
        <h2 class="m-0 text-[clamp(1.4rem,2vw+0.8rem,2rem)] font-semibold text-slate-100">{{ show.name }}</h2>
        <p class="text-slate-300">⭐ {{ formatRating(show.rating.average) }} · {{ formatValue(show.language) }} · {{ genreList }}</p>

        <dl class="my-3 grid gap-2.5 md:grid-cols-3">
          <div class="rounded-lg border border-slate-700 p-2.5">
            <dt class="text-xs text-slate-400">Status</dt>
            <dd class="mt-1">{{ formatValue(show.status) }}</dd>
          </div>
          <div class="rounded-lg border border-slate-700 p-2.5">
            <dt class="text-xs text-slate-400">Premiered</dt>
            <dd class="mt-1">{{ formatValue(show.premiered) }}</dd>
          </div>
          <div class="rounded-lg border border-slate-700 p-2.5">
            <dt class="text-xs text-slate-400">Runtime</dt>
            <dd class="mt-1">{{ show.runtime ? `${show.runtime} min` : "Unknown" }}</dd>
          </div>
        </dl>

        <p class="text-slate-100/95">{{ summary || "No summary available." }}</p>
      </div>
    </article>
  </section>
</template>
