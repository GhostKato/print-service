<template>
  <header class="container">
    <IButton to="/"> <ILogo /> </IButton>
    <nav class="nav">
      <IButton to="/catalog" variant="header-link"> {{ $t('header.catalog') }} </IButton>
    </nav>

    <div v-if="isLargeScreen" class="desktop-bar">
      <UserBar />
    </div>
    <div v-else class="mobile-bar">
      <ChatButton />
      <MenuButton />
    </div>
  </header>
</template>

<script setup lang="ts">
import ILogo from './ILogo.vue'
import IButton from '../IButton/IButton.vue'

import MenuButton from './MenuButton.vue'
import ChatButton from './ChatButton.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import UserBar from './UserBar.vue'

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const isLargeScreen = computed(() => windowWidth.value >= 1920)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
.container {
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.nav {
  display: flex;
  gap: 15px;
}

.mobile-bar {
  display: flex;
  position: absolute;
  top: 17px;
  right: 1px;
}
.icon {
  width: 25px;
  height: 25px;
}

.icon:hover {
  fill: var(--color-hover);
}
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    justify-content: space-around;
  }
  .mobile-bar {
    position: static;
    display: flex;
    justify-content: flex-end;
    width: 200px;
  }
}
@media (min-width: 1024px) {
  .mobile-bar {
    width: 250px;
  }
  .icon {
    width: 35px;
    height: 35px;
  }
}
</style>
