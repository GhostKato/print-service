<template>
  <svg
    class="bell-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="width"
    :height="height"
    fill="currentColor"
  >
    <path
      d="M12 2a7 7 0 00-7 7v5H4a1 1 0 000 2h16a1 1 0 100-2h-1V9a7 7 0 00-7-7zm0 20a2 2 0 002-2H10a2 2 0 002 2z"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  width?: number | string
  height?: number | string
}>()

const width = props.width ?? 24
const height = props.height ?? 24
</script>

<style scoped>
.bell-icon {
  color: var(--color-white);
}
</style>
