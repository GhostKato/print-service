<template>
  <IButton @click="toggleMenu" variant="menu-btn">
    <ChatIcon class="bell-icon" :class="{ 'animate-bell': hasUnreadMessages }" />
  </IButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import IButton from '@/components/IButton/IButton.vue'
import ChatIcon from '../icons/ChatIcon.vue'

const modalStore = useModalStore()
const chatStore = useChatStore()

const chats = computed(() => chatStore.chats)

const hasUnreadMessages = computed(() => {

  return chats.value.some(chat => chat.isRead === false)
})

function toggleMenu() {
    modalStore.toggle('chat')
    }
</script>

<style scoped>
@keyframes bell-shake {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(10deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.bell-icon {
  width: 30px;
  height: 30px;
  color: var(--color-white);
  transition: color 0.3s ease;
}

.animate-bell {
  animation: bell-shake 0.8s ease-in-out infinite;
  color: var(--color-red);
}

.bell-icon:hover {
  color: var(--color-hover);
}
</style>
