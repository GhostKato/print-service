<template>
  <Pencil
    v-bind="$attrs"
    :size="iconSize"
    :color="color ?? 'currentColor'"
    :stroke-width="strokeWidth ?? 2"
    class="edit-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pencil } from 'lucide-vue-next'

const props = defineProps<{
  size?: number | string
  color?: string
  strokeWidth?: number
}>()

const iconSize = computed(() => Number(props.size ?? 24))
</script>

<style scoped>
.edit-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.edit-icon:hover {
  cursor: pointer;
  transform: rotate(-15deg) scale(1.1);
  color: #3b82f6;
}
</style>
