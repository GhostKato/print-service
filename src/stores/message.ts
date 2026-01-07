import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as FirestoreAPI from '@/api/users'
import { useAuthStore } from './auth'
import type { Message } from '@/types'

export const useMessageStore = defineStore('messages', () => {
  const authStore = useAuthStore()


  const messages = ref<Message[]>([])
  const currentChatId = ref<string | null>(null)
  const unsubscribe = ref<(() => void) | null>(null)

  const openChat = (chatId: string) => {
    if (unsubscribe.value) unsubscribe.value()
    currentChatId.value = chatId

    unsubscribe.value = FirestoreAPI.subscribeToMessages(chatId, (data) => {
      messages.value = data
    })
  }

  const sendMessage = async (text: string) => {

  const id = currentChatId.value || authStore.user?.uid

  if (!id || !authStore.user) return

  try {
    await FirestoreAPI.sendMessage(
      id,
      authStore.user.uid,
      text,
      authStore.profile?.displayName || authStore.user.displayName || ""
    )
    if (!currentChatId.value) currentChatId.value = id
  } catch (error) {
    console.error("Помилка:", error)
  }
}

  const closeChat = () => {
    if (unsubscribe.value) unsubscribe.value()
    messages.value = []
    currentChatId.value = null
  }

  return { messages, currentChatId, openChat, sendMessage, closeChat }
})
