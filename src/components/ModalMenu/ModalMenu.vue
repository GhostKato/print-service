<template>
  <Transition name="slide-right">
    <div
      v-if="modalStore.modals.menu"
      class="modal-menu-wrapper"
      @click.self="modalStore.close('menu')"
    >
      <div class="modal-menu">
        <div class="auth-container">
          <IButton @click="modalStore.close('menu')" variant="close"><XIcon /></IButton>
          <h3 class="user-greeting">{{ $t('modal_menu.title_welcome') }}</h3>
          <h3 class="user-name">{{ nickname }}</h3>

          <IButton v-if="authStore.user" @click="openUpdateModal()" variant="menu-edit-btn">
            {{ $t('modal_menu.edit') }}
          </IButton>

          <IButton
            @click="authStore.user ? handleLogout() : openAuthModal()"
            variant="menu-auth-btn"
          >
            {{ authStore.user ? $t('modal_menu.logout') : $t('modal_menu.login') }}
          </IButton>
        </div>

        <div class="language-container">
          <h3 class="language-title">{{ $t('modal_menu.title_language_selection') }}</h3>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import LanguageSwitcher from './LanguageSwitcher.vue'
import IButton from '../IButton/IButton.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { notificationStore } from '@/stores/notifications'
import { autoClose } from '@/utils/autoClose'
import XIcon from '../icons/XIcon.vue'

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

autoClose('menu')
</script>

<style scoped>
.modal-menu-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-top: 55px;
  padding-right: 5px;
  z-index: 50;
  pointer-events: all;
}
.modal-menu {
  padding: 10px;
  border-radius: 8px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.update-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  color: var(--color-white);
}
.update-btn:hover {
  color: var(--color-hover);
}
.auth-container,
.language-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: var(--color-transparent-black);
  backdrop-filter: blur(14px) saturate(160%);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--color-grey);
}
.auth-container {
  padding-top: 30px;
}
.user-name,
.language-title,
.user-greeting {
  text-align: center;
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
@media (min-width: 768px) {
  .modal-menu-wrapper {
    padding-top: 70px;
  }
  .user-name,
  .language-title,
  .user-greeting {
    font-size: 20px;
  }
}
</style>
