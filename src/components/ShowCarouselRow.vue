<script setup lang="ts">
import { RouterLink } from "vue-router"
import type { TvMazeShow } from "../types/tvmaze"
import ShowCard from "./ShowCard.vue"

defineProps<{
  shows: TvMazeShow[]
}>()
</script>

<template>
  <div class="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible px-0.5 py-2 [scrollbar-color:#475569_transparent]">
    <RouterLink
      v-for="show in shows"
      :key="show.id"
      :to="`/shows/${show.id}`"
      class="snap-start rounded-xl text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
    >
      <ShowCard :show="show" />
    </RouterLink>
  </div>
</template>
