<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import ShowCard from "../components/ShowCard.vue"
import { useWatchlist } from "../composables/useWatchlist"
import { useShowsCache } from "../composables/useShowsCache"
import { loadDashboardShows } from "../api/useDashboardShowsData"

const { watchlistIds } = useWatchlist()
const { getCache, setCache } = useShowsCache()

const isLoading = ref(false)

const allShows = computed(() => getCache() ?? [])
const favoriteShows = computed(() => {
  return allShows.value.filter((show) => watchlistIds.value.has(show.id))
})

onMounted(async () => {
  const cached = getCache()
  if (!cached) {
    isLoading.value = true
    const result = await loadDashboardShows()
    if (result.sourceShows) {
      setCache(result.sourceShows)
    }
    isLoading.value = false
  }
})
</script>

<template>
  <section class="grid gap-6">
    <RouterLink to="/" class="w-fit text-neutral-300 no-underline transition hover:text-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500">
      ← Back to dashboard
    </RouterLink>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-neutral-400">Loading your watchlist...</p>
    </div>

    <div v-else-if="favoriteShows.length === 0" class="text-center py-12">
      <p class="text-neutral-400 text-lg">No favorites yet!</p>
      <p class="text-neutral-500">Add shows to your watchlist and they'll appear here.</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold text-white mb-4">My Watchlist ({{ favoriteShows.length }})</h1>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ShowCard v-for="show in favoriteShows" :key="show.id" :show="show" />
      </div>
    </div>
  </section>
</template>
