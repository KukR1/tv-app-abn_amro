<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue"
import AppLayout from "./layouts/AppLayout.vue"
</script>

<template>
  <AppLayout>
    <template #header>
      <Transition appear name="header-drop">
        <AppHeader title="TV Maze" />
      </Transition>
    </template>
    <RouterView />
  </AppLayout>
</template>
