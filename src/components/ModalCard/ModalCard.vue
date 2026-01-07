<template>

    <div
      v-if="modalStore.modals.card"
      class="modal-chat-wrapper"
      @click.self="modalStore.close('card')"
    >
      <div class="chat-list">
        <div class="chat-container">
          <h2 class="main-title">Додати нову візитку</h2>

          <IButton class="close-btn" @click="modalStore.close('card')" variant="close">
            <XIcon />
          </IButton>

          <div class="chat-scroll">
            <form @submit.prevent="handleCardSubmit" class="content-form">
              <div class="input-group">
                <input v-model="cardData.title" type="text" placeholder="Назва візитки" required />
              </div>

              <div class="input-group">
                <textarea v-model="cardData.description" placeholder="Опис послуги"></textarea>
              </div>

              <div class="input-group">
                <input v-model.number="cardData.price" type="number" placeholder="Ціна (грн)" required />
              </div>

              <div class="file-upload">
                <label for="card-image">Фото візитки:</label>
                <div class="custom-file-input">
                  <input id="card-image" type="file" @change="onFileSelected" accept="image/*" />
                  <span v-if="imageFile">{{ imageFile.name }}</span>
                  <span v-else>Оберіть файл...</span>
                </div>
              </div>

              <IButton
                type="submit"
                variant="release-clear-all-btn"
                :disabled="isLoading || !imageFile"
              >
                {{ isLoading ? 'Завантаження...' : 'Зберегти картку' }}
              </IButton>
            </form>
          </div>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useContentStore } from '@/stores/content'
import IButton from '../IButton/IButton.vue'
import XIcon from '../icons/XIcon.vue'

const modalStore = useModalStore()
const contentStore = useContentStore()

const isLoading = ref(false)
const imageFile = ref<File | null>(null)

const cardData = reactive({
  title: '',
  description: '',
  price: 0
})

const onFileSelected = (event: any) => {
  const file = event.target.files[0]
  if (file) imageFile.value = file
}

const handleCardSubmit = async () => {
  if (!imageFile.value) return
  isLoading.value = true
  try {
    await contentStore.addCard(cardData.title, cardData.description, cardData.price, imageFile.value)


    cardData.title = ''
    cardData.description = ''
    cardData.price = 0
    imageFile.value = null
    modalStore.close('card')
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

.modal-chat-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
 justify-content: center;
  align-items: center;
  z-index: 150;
}

.chat-list {
  pointer-events: all;
}

.chat-container {
  display: flex;
  flex-direction: column;
  background-color: var(--color-transparent-black);
  backdrop-filter: blur(14px) saturate(160%);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--color-grey);
  width: 355px;
  position: relative;
}

.main-title {
  margin: 0 0 15px 0;
  font-size: 20px;
  text-shadow: 0 0 15px var(--color-shadow-black);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.chat-scroll {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: 80vh;
}


.content-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input, textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-grey);
  border-radius: 6px;
  padding: 10px;
  color: white;
  outline: none;
}

input:focus, textarea:focus {
  border-color: var(--color-hover);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  color: #aaa;
}

.custom-file-input {
  border: 1px dashed var(--color-grey);
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.custom-file-input input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
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
</style>
