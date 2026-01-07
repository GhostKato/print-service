import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as FirestoreAPI from '@/api/users'
import { useAuthStore } from './auth'
import type { Chat } from '@/types'

export const useChatStore = defineStore('chats', () => {
  const authStore = useAuthStore()
  const chats = ref<Chat[]>([])
  const unsubscribe = ref<(() => void) | null>(null)

  const initChatListener = () => {
    if (unsubscribe.value) unsubscribe.value()
    if (!authStore.profile) return

    unsubscribe.value = FirestoreAPI.subscribeToChats(
      authStore.profile.role,
      authStore.profile.id,
      (data: Chat[]) => {
        chats.value = data
      }
    )
  }
  
  const stopListener = () => {
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
  }

  return { chats, initChatListener, stopListener }
})
