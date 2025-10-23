<template>
  <Navbar />
  <main class="pt-20 pb-10 px-4 bg-gray-100 min-h-screen">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>
