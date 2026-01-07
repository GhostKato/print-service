<template>
  <div class="custom-select" ref="selectRef">
    <div class="select-trigger" @click="toggle" :class="{ open: isOpen }">
      <span>{{ selectedLabel }}</span>
    </div>

    <div v-if="isOpen" class="options-dropdown">
      <div
        v-for="option in options"
        :key="String(option.value)"
        class="option"
        :class="{ active: modelValue === option.value }"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | undefined">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option<T> {
  label: string
  value: T
}

const props = defineProps<{
  options: Option<T>[]
  modelValue: T
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const toggle = () => (isOpen.value = !isOpen.value)

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue)
  return found ? found.label : ''
})

const selectOption = (val: T) => {
  emit('update:modelValue', val)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 165px;
  user-select: none;
}
.select-trigger {
  width: 100%;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--color-white);
  background-color: var(--color-dark-grey);
  cursor: pointer;
  font-size: 16px;
  transition:
    outline 0.2s,
    background-color 0.2s;
}
.select-trigger:hover,
.select-trigger.open {
  outline: 1px solid var(--color-hover);
}
.selected-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}
.options-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: var(--color-dark-grey);
  border-radius: 8px;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 265px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.options-dropdown {
  scrollbar-width: thin;
  scrollbar-color: var(--color-hover) transparent;
  padding-right: 4px;
}
.options-dropdown::-webkit-scrollbar {
  display: block;
  width: 5px;
}
.options-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
.options-dropdown::-webkit-scrollbar-thumb {
  background-color: var(--color-hover);
  border-radius: 10px;
}
.options-dropdown::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-white);
}
.option {
  padding: 10px 12px;
  color: var(--color-white);
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}
.option:hover {
  background-color: var(--color-hover);
}
.option.active {
  background-color: var(--color-red);
}
@media (min-width: 768px) {
  .custom-select {
    width: max-content;
    min-width: 65px;
  }
  .select-trigger {
    height: auto;
    padding: 5px 5px;
    white-space: nowrap;
  }
  .options-dropdown {
    min-width: 100%;
    width: max-content;
  }
  .option {
    white-space: nowrap;
    padding: 10px 1px;
    text-align: center;
  }
}
@media (min-width: 1024px) {
  .select-trigger,
  .option {
    font-size: 20px;
  }
}
@media (min-width: 2560px) {
  .custom-select {
    min-width: 80px;
  }
  .select-trigger {
    height: 43px;
  }
}
</style>
