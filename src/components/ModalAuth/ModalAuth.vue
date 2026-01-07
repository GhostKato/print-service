<template>
  <div v-if="modalStore.modals.auth" class="modal-backdrop" @click.self="modalStore.close('auth')">
    <div class="modal-content">
      <IButton @click="modalStore.close('auth')" variant="close"><XIcon /></IButton>
      <div class="switch-buttons" v-if="authStore.mode !== 'edit'">
        <IButton
          variant="auth-nav-btn"
          :class="{ active: authStore.mode === 'login' }"
          @click="authStore.setMode('login')"
        >
          {{ $t('modal_auth.nav_btn_login') }}
        </IButton>
        <IButton
          variant="auth-nav-btn"
          :class="{ active: authStore.mode === 'register' }"
          @click="authStore.setMode('register')"
        >
          {{ $t('modal_auth.nav_btn_register') }}
        </IButton>
      </div>
      <h2 class="title-edit" v-else>{{ $t('modal_edit.title') }}</h2>

      <IForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModalStore } from '@/stores/modal'
import IForm from './IForm.vue'
import IButton from '../IButton/IButton.vue'
import { useAuthStore } from '@/stores/auth'
import XIcon from '../icons/XIcon.vue'
import { autoClose } from '@/utils/autoClose'

const modalStore = useModalStore()
const authStore = useAuthStore()

autoClose('auth', 50000)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-transparent-black);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 80;
}
.modal-content {
  background-color: var(--color-transparent-black);
  backdrop-filter: blur(14px) saturate(160%);
  padding: 40px 15px 15px 15px;
  border-radius: 8px;
  width: 320px;
  border: 1px solid var(--color-grey);
}
.switch-buttons {
  display: flex;
  margin-bottom: 10px;
}
.title-edit {
  text-align: center;
  margin-bottom: 10px;
}
@media (min-width: 768px) {
  .modal-content {
    width: 420px;
  }
}
</style>
