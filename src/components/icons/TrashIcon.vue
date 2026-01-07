<template>
  <Trash2
    v-bind="$attrs"
    :size="iconSize"
    :color="color"
    :stroke-width="strokeWidth"
    class="lucide-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 20,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
})

const iconSize = computed(() => Number(props.size))
</script>

<style scoped>
.lucide-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}
.lucide-icon:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
