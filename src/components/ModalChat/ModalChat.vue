<template>
  <Transition name="slide-right">
    <div v-if="modalStore.modals.chat" class="modal-chat-wrapper" @click.self="modalStore.close('chat')">
      <div class="chat-container">

        <div class="header">

          <IButton v-if="authStore.isAdmin && messageStore.currentChatId" @click="goBackToList" variant="back"><ArrowLeftIcon/></IButton>
          <h2 class="main-title">
            {{ (authStore.isAdmin && !messageStore.currentChatId) ? $t('modal_chat.title') : 'Диалог с клиентом' }}
          </h2>
          <IButton @click="modalStore.close('chat')" variant="close"><XIcon /></IButton>
        </div>

        <div v-if="authStore.isAdmin && !messageStore.currentChatId" class="chat-scroll">
          <div v-for="chat in chatStore.chats" :key="chat.id" class="chat-card" @click="selectChat(chat.id)">
            <div class="user-avatar">{{ chat.userName?.charAt(0) || 'U' }}</div>
            <div class="info">
              <h4 class="title">{{ chat.userName || 'Пользователь' }}</h4>
              <p class="last-msg">{{ chat.lastMessage || 'Нет сообщений' }}</p>
              <div class="chat-meta"><span class="time">{{ formatTime(chat.updatedAt) }}</span></div>
              <div v-if="!chat.isRead" class="unread-dot"></div>
            </div>
          </div>
          <div v-if="chatStore.chats.length === 0" class="empty-state">Нет активных чатов.</div>
        </div>

        <div v-else class="dialog-area">
          <div class="messages-list">
            <div v-for="msg in messageStore.messages" :key="msg.id" :class="['message-bubble', { 'is-admin': msg.senderId !== msg.chatId }]">
              {{ msg.text }}
            </div>
          </div>
          <IForm/>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useChatStore } from '@/stores/chat'
import { useMessageStore } from '@/stores/message'
import { useAuthStore } from '@/stores/auth'
import IButton from '../IButton/IButton.vue'
import XIcon from '../icons/XIcon.vue'
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue'
import IForm from './IForm.vue'

const modalStore = useModalStore()
const chatStore = useChatStore()
const messageStore = useMessageStore()
const authStore = useAuthStore()

const checkAutoOpen = () => {
  if (!authStore.isAdmin && authStore.user?.uid) {
    messageStore.openChat(authStore.user.uid)
  }
}

onMounted(() => {
  chatStore.initChatListener()
  checkAutoOpen()
})

watch(() => authStore.user, () => {
  checkAutoOpen()
})

onUnmounted(() => {
  chatStore.stopListener()
})

const selectChat = (chatId: string) => {
  messageStore.openChat(chatId)
}

const goBackToList = () => {
  messageStore.closeChat()
}

const formatTime = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>

.modal-chat-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  top: 10px;
  right: 10px;
  z-index: 50;
}
.chat-list {
  pointer-events: all;
}
.chat-container {
  display: flex;
  flex-direction: column;
  background-color: var(--color-transparent-black);
  backdrop-filter: blur(14px) saturate(160%);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--color-grey);
  width: 355px;
  min-height: 400px;
}
.main-title {
  margin: 0;
  font-size: 20px;
  text-shadow: 0 0 15px var(--color-shadow-black);
  margin-bottom: 10px;
}

.chat-scroll {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  --item-height: 96px;
  --max-items: 7;
  max-height: calc(var(--item-height) * var(--max-items));
}
:deep(.chat-scroll::-webkit-scrollbar) {
  display: none;
}
:deep(.chat-scroll) {
  scrollbar-width: none;
}

.chat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--color-transparent-black);
  border-radius: 8px;
  padding: 5px;
  border: 1px solid var(--color-grey);
  cursor: pointer;
  position: relative;
  height: calc(var(--item-height) - 10px);
}
.chat-card:hover, .chat-card.active {
  border-color: var(--color-hover);
  background-color: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  flex-grow: 1;
}
.title {
  margin: 0;
  font-size: 18px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.last-msg {
  margin: 0;
  font-size: 14px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-meta {
  font-size: 11px;
  color: #666;
}

.unread-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: var(--color-red, #ff4444);
  border-radius: 50%;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}
.dialog-area {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
}
.messages-list {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message-bubble {
    padding: 8px 12px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    max-width: 80%;
    color: white;
}

.message-bubble.is-admin {
    align-self: flex-end;
    background: var(--color-primary, #007bff);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (min-width: 1920px) {
  .chat-scroll {
    --max-items: 7;
  }
}
@media (min-width: 2560px) {
  .chat-scroll {
    --max-items: 11;
  }
}
</style>
