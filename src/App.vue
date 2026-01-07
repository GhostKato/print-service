<template>
  <IHeader />
  <main>
    <router-view :key="$route.fullPath" />
  </main>
  <ModalMenu />
  <ModalAuth />
  <ModalChat />
  <ModalCard/>
  <ILoader />
  <INotification />
</template>

<script setup lang="ts">
import IHeader from '@/components/IHeader/IHeader.vue'
import ILoader from '@/components/ILoader/ILoader.vue'
import ModalMenu from '@/components/ModalMenu/ModalMenu.vue'
import ModalAuth from './components/ModalAuth/ModalAuth.vue'
import { useAuthStore } from './stores/auth'
import INotification from './components/INotification/INotification.vue'
import ModalChat from './components/ModalChat/ModalChat.vue'
import ModalCard from './components/ModalCard/ModalCard.vue'

const authStore = useAuthStore()

authStore.initAuthListener()

</script>
