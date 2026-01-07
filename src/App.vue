<template>
  <IHeader />
  <main>
    <router-view :key="$route.fullPath" />
  </main>
  <ModalMenu />
  <ModalAuth />
  <ModalChat />
  <ModalCard />
  <AdminBar v-if="authStore.isStaff && !modalStore.modals.addCard" />
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
import AdminBar from './components/AdminBar/AdminBar.vue'
import { useModalStore } from './stores/modal'

const authStore = useAuthStore()
const modalStore = useModalStore()

authStore.initAuthListener()
</script>
