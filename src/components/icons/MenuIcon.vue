<template>
  <Menu
    v-bind="$attrs"
    :size="iconSize"
    :color="color ?? '#ffffff'"
    :stroke-width="strokeWidth ?? 2"
  />
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  size?: number | string
  color?: string
  strokeWidth?: number
}>()

const iconSize = computed(() => Number(props.size ?? 30))
</script>
