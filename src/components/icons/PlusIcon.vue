<template>
  <Plus
    v-bind="$attrs"
    :size="iconSize"
    :color="color ?? 'currentColor'"
    :stroke-width="strokeWidth ?? 2"
    class="plus-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  size?: number | string
  color?: string
  strokeWidth?: number
}>()

const iconSize = computed(() => Number(props.size ?? 24))
</script>

<style scoped>
.plus-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.plus-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
