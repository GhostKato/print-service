<template>
  <X
    v-bind="$attrs"
    :size="iconSize"
    :color="color ?? 'currentColor'"
    :stroke-width="strokeWidth ?? 2"
    class="icon-x"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  size?: number | string
  color?: string
  strokeWidth?: number
}>()

const iconSize = computed(() => Number(props.size ?? 25))
</script>

<style scoped>
.icon-x {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-x:hover {
  transform: rotate(90deg);
  opacity: 0.7;
}

.icon-x:active {
  transform: scale(0.9);
}
</style>
