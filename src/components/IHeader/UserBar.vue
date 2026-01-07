<template>
  <div class="user-bar">
    <ChatButton />
    <LanguageSwitcher />

    <IButton
      @click="authStore.user ? openUpdateModal() : showGuestNotification()"
      variant="menu-edit-btn"
    >
      {{ nickname }}
    </IButton>
    <IButton @click="authStore.user ? handleLogout() : openAuthModal()" variant="menu-auth-btn">
      {{ authStore.user ? $t('modal_menu.logout') : $t('modal_menu.login') }}
    </IButton>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import LanguageSwitcher from '../ModalMenu/LanguageSwitcher.vue'
import IButton from '../IButton/IButton.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { notificationStore } from '@/stores/notifications'
import ChatButton from './ChatButton.vue'

const modalStore = useModalStore()
const authStore = useAuthStore()
const width = ref(window.innerWidth)
const { t } = useI18n()

function openAuthModal() {
  modalStore.close('menu')
  modalStore.open('auth')
  authStore.setMode('login')
}
const handleLogout = async () => {
  await authStore.logout()
  modalStore.close('menu')
}

function openUpdateModal() {
  modalStore.close('menu')
  modalStore.open('auth')
  authStore.setMode('edit')
  notificationStore.info(t('notification_message.updated_profile_user_info'))
}

function showGuestNotification() {
  notificationStore.info(t('notification_message.updated_profile_guest_info'))
}

const handleResize = () => {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const nickname = computed(() => authStore.user?.displayName ?? t('modal_menu.displayName'))
</script>

<style scoped>
.user-bar {
  display: flex;
  gap: 10px;
  width: 475px;
}
@media (min-width: 2560px) {
  .user-bar {
    width: 500px;
  }
}
</style>
