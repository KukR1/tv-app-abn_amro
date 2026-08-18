<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="app-header">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>

      <img
        src="https://api.dicebear.com/10.x/sprouts/svg?seed=Felix"
        alt="Profile avatar"
        class="h-10 w-10 shrink-0 cursor-pointer rounded-md border-2 border-sky-400/70 bg-slate-900 object-cover shadow-md md:h-12 md:w-12"
      />
    </div>
  </header>
</template>
