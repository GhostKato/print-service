<template>
  <Mail
    v-bind="$attrs"
    :size="iconSize"
    :color="color ?? 'currentColor'"
    :stroke-width="strokeWidth ?? 2"
    class="mail-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Mail } from 'lucide-vue-next'

const props = defineProps<{
  size?: number | string
  color?: string
  strokeWidth?: number
}>()

const iconSize = computed(() => Number(props.size ?? 24))
</script>

<style scoped>
.mail-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: all 0.2s ease-in-out;
}

.mail-icon:hover {
  cursor: pointer;
  transform: translateY(-2px);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>
