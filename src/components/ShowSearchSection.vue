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
    class="sticky top-4 z-20 grid max-w-full min-w-0 gap-2.5 overflow-hidden rounded-xl border p-3 transition duration-200"
    :class="isActive ? 'border-sky-400/60 bg-slate-950/95 shadow-[0_18px_45px_rgba(2,6,23,0.75)] backdrop-blur-md' : 'border-slate-700 bg-slate-900/40'"
  >
    <input
      id="show-search"
      :value="query"
      type="search"
      placeholder="Search"
      autocomplete="off"
      class="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
      @input="emit('update:query', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="isSearching" class="text-sm text-slate-300">Searching...</p>
    <p v-else-if="errorMessage" class="text-sm text-red-200">{{ errorMessage }}</p>
    <p v-else-if="query.trim() && results.length === 0" class="text-sm text-slate-300">No shows found.</p>

    <div v-if="results.length > 0" class="max-w-full min-w-0 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
      <TransitionGroup name="card-pop" tag="div" class="flex max-w-full min-w-0 gap-3 overflow-x-auto overflow-y-hidden px-0.5 py-2 [scrollbar-color:#475569_transparent]">
        <RouterLink
          v-for="(show, index) in results"
          :key="show.id"
          :to="`/shows/${show.id}`"
          :style="{ '--i': index }"
          class="shrink-0 rounded-xl text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        >
          <ShowCard :show="show" />
        </RouterLink>
      </TransitionGroup>
    </div>
  </section>
</template>
