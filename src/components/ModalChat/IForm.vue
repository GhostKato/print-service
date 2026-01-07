<template>
  <div v-if="authStore.user" class="chat-input-area">
    <textarea
      v-model="text"
      @keydown.enter.prevent="send"
      placeholder="Напишіть повідомлення..."
    ></textarea>
    <button @click="send" :disabled="!text.trim()">Відправити</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageStore } from '@/stores/message'
import { useAuthStore } from '@/stores/auth'

const text = ref('')
const messageStore = useMessageStore()
const authStore = useAuthStore()

const send = async () => {
  if (!text.value.trim()) return
  await messageStore.sendMessage(text.value)
  text.value = ''
}
</script>
