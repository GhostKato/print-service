<template>
  <teleport to="body">
    <div v-if="loaderStore.isGlobalLoading" class="loader-overlay"></div>

    <div v-if="loaderStore.isLoading" class="spinner-container">
      <div class="spinner"></div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useLoaderStore } from '@/stores/loader'

const loaderStore = useLoaderStore()
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-transparent-black);
  backdrop-filter: blur(2px);
  z-index: 9998;
}

.spinner-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid var(--color-grey);
  border-top-color: var(--color-white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
