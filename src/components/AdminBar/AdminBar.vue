<template>
  <div class="admin-bar">
    <button class="add-button" @click="handleButtonClick">
      <PlusIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import PlusIcon from '../icons/PlusIcon.vue'

const modalStore = useModalStore()

const handleButtonClick = () => {
  modalStore.open('addCard')
}
</script>

<style scoped>
.admin-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
.add-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-red);
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}
.add-button:hover {
  background-color: var(--color-hover);
}
</style>
