<script setup lang="ts">
import { RouterLink } from "vue-router"
import type { TvMazeShow } from "../types/tvmaze"
import ShowCard from "./ShowCard.vue"

const props = defineProps<{
  query: string
  results: TvMazeShow[]
  isSearching: boolean
  errorMessage: string | null
  isActive: boolean
}>()

const emit = defineEmits<{
  "update:query": [value: string]
}>()
</script>

<template>
  <section
    class="sticky top-4 z-20 grid max-w-full min-w-0 gap-2.5 overflow-hidden rounded-lg border p-3 transition duration-200"
    :class="isActive ? 'border-yellow-500 bg-neutral-900/80 shadow-[0_8px_24px_rgba(243,192,0,0.1)] backdrop-blur-md' : 'border-neutral-700 bg-neutral-950/60'"
  >
    <input
      id="show-search"
      :value="query"
      type="search"
      placeholder="Search shows..."
      autocomplete="off"
      class="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      @input="emit('update:query', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="isSearching" class="text-sm text-neutral-400">Searching...</p>
    <p v-else-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</p>
    <p v-else-if="query.trim() && results.length === 0" class="text-sm text-neutral-400">No shows found.</p>

    <div v-if="results.length > 0" class="max-w-full min-w-0 overflow-hidden rounded-lg bg-neutral-900/40 p-3">
      <TransitionGroup name="card-pop" tag="div" class="flex max-w-full min-w-0 gap-3 overflow-x-auto overflow-y-hidden px-0.5 py-2 [scrollbar-color:#404040_transparent]">
        <RouterLink
          v-for="(show, index) in results"
          :key="show.id"
          :to="`/shows/${show.id}`"
          :style="{ '--i': index }"
          class="shrink-0 rounded-lg text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
        >
          <ShowCard :show="show" />
        </RouterLink>
      </TransitionGroup>
    </div>
  </section>
</template>
