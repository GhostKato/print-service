<template>
  <div
    v-if="modalStore.modals.addCard || modalStore.modals.editCard || modalStore.modals.detailsCard"
    class="modal-overlay"
    @click.self="handleClose"
  >
    <div class="modal-container" :class="{ 'details-mode': isDetails }">
      <h2 class="main-title">{{ modalTitle }}</h2>

      <IButton class="close-btn" @click="handleClose" variant="close">
        <XIcon />
      </IButton>

      <div class="modal-content">
        <div v-if="isDetails" class="details-view">
          <img :src="currentData?.imageUrl" :alt="currentData?.title" class="details-img" />
          <div class="details-info">
            <p class="details-price">{{ currentData?.price }} грн</p>
            <p class="details-desc">{{ currentData?.description || 'Немає опису' }}</p>
          </div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="content-form">
          <div class="input-group">
            <input v-model="formData.title" type="text" placeholder="Назва візитки" required />
          </div>

          <div class="input-group">
            <textarea v-model="formData.description" placeholder="Опис послуги"></textarea>
          </div>

          <div class="input-group">
            <input
              v-model.number="formData.price"
              type="number"
              placeholder="Ціна (грн)"
              required
            />
          </div>

          <div class="file-upload">
            <label for="card-image">{{
              isEdit ? 'Змінити фото (необов’язково):' : 'Фото візитки:'
            }}</label>
            <div class="custom-file-input">
              <input id="card-image" type="file" @change="onFileSelected" accept="image/*" />
              <span v-if="imageFile">{{ imageFile.name }}</span>
              <span v-else-if="isEdit">Поточне зображення збережено</span>
              <span v-else>Оберіть файл...</span>
            </div>
          </div>

          <IButton
            type="submit"
            variant="release-clear-all-btn"
            :disabled="isLoading || (!imageFile && !isEdit)"
          >
            {{ isLoading ? 'Завантаження...' : isEdit ? 'Оновити дані' : 'Зберегти картку' }}
          </IButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useCardStore } from '@/stores/card'
import IButton from '../IButton/IButton.vue'
import XIcon from '../icons/XIcon.vue'

const modalStore = useModalStore()
const cardStore = useCardStore()

const isLoading = ref(false)
const imageFile = ref<File | null>(null)

const isDetails = computed(() => modalStore.modals.detailsCard)
const isEdit = computed(() => modalStore.modals.editCard)
const currentData = computed(() => modalStore.modalData)

const modalTitle = computed(() => {
  if (isDetails.value) return currentData.value?.title
  if (isEdit.value) return 'Редагувати візитку'
  return 'Додати нову візитку'
})

const formData = reactive({
  title: '',
  description: '',
  price: 0,
})

watch(
  currentData,
  (newData) => {
    if (newData && isEdit.value) {
      formData.title = newData.title
      formData.description = newData.description
      formData.price = newData.price
    } else if (!isEdit.value) {
      formData.title = ''
      formData.description = ''
      formData.price = 0
    }
  },
  { immediate: true },
)

const onFileSelected = (event: any) => {
  const file = event.target.files[0]
  if (file) imageFile.value = file
}

const handleClose = () => {
  modalStore.closeAll()
  imageFile.value = null
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEdit.value && currentData.value) {
      await cardStore.editCard(
        currentData.value.id,
        { ...formData },
        imageFile.value || undefined,
        currentData.value.imageUrl,
      )
    } else {
      if (!imageFile.value) return
      await cardStore.addCard(formData.title, formData.description, formData.price, imageFile.value)
    }
    handleClose()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 150;
  backdrop-filter: blur(5px);
}
.modal-container {
  background-color: var(--color-transparent-black);
  backdrop-filter: blur(14px) saturate(160%);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--color-grey);
  width: 100%;
  max-width: 400px;
  position: relative;
}
.details-mode {
  max-width: 500px;
}
.details-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}
.details-price {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 10px;
}
.details-desc {
  line-height: 1.5;
  color: #ccc;
}
.main-title {
  margin: 0 0 20px 0;
  font-size: 22px;
  color: white;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
}
.content-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input,
textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-grey);
  border-radius: 6px;
  padding: 12px;
  color: white;
}
.file-upload .custom-file-input {
  border: 1px dashed var(--color-grey);
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  position: relative;
}
.custom-file-input input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
