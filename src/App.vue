<template>
  <div class="w-full h-full flex flex-col ink-bg">
    <NavBar />
    <main class="flex-1 overflow-hidden relative">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>
