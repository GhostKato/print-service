<template>
  <div class="card-list">
    <!-- Состояние пустых карточек -->
    <div v-if="cardStore.cards.length === 0" class="empty-state">
      <p>{{ $t('media_list.not_found') }}</p>
    </div>

    <!-- Сетка карточек -->
    <div v-else class="card-grid">
      <div
        v-for="card in cardStore.cards"
        :key="card.id"
        class="card-item"
        @click="openDetails(card)"
      >
        <img :src="card.imageUrl" :alt="card.title" loading="lazy" />

        <div class="card-info">
          <!-- Панель управления (Staff only) -->
          <div v-if="authStore.isStaff" class="admin-controls">
            <button class="control-btn edit-btn" @click.stop="handleEdit(card)" title="Редагувати">
              <EditIcon :size="18" />
            </button>
            <button
              class="control-btn delete-btn-top"
              @click.stop="cardStore.deleteCard(card.id)"
              title="Видалити"
            >
              <TrashIcon :size="18" />
            </button>
          </div>

          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-price">{{ card.price }} грн</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCardStore } from '@/stores/card'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal' // Предполагается наличие стора для модалок
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import type { Card } from '@/types'

const cardStore = useCardStore()
const authStore = useAuthStore()
const modalStore = useModalStore() // Подключаем стор модалок

let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = cardStore.initCardsListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

/**
 * Открытие модалки деталей
 * Используем ключ 'detailsCard'
 */
const openDetails = (card: Card) => {
  modalStore.open('detailsCard', card)
}

/**
 * Открытие модалки редактирования
 * Используем ключ 'editCard'
 */
const handleEdit = (card: Card) => {
  modalStore.open('editCard', card)
}
</script>

<style scoped>
/* Стили остаются прежними, они корректно настроены */
.card-list {
  padding: 20px;
  min-height: 400px;
}
.empty-state {
  text-align: center;
  color: #fff;
  margin-top: 60px;
  font-size: 1.2rem;
  opacity: 0.7;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.card-item {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}
.card-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
.card-item:hover img {
  transform: scale(1.05);
}
.card-info {
  position: absolute;
  inset: 0;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3), transparent);
  color: #fff;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-price {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #4caf50;
}
.admin-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 10;
}
.control-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}
.edit-btn {
  background: rgba(59, 130, 246, 0.9);
}
.edit-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}
.delete-btn-top {
  background: rgba(239, 68, 68, 0.9);
}
.delete-btn-top:hover {
  background: #dc2626;
  transform: scale(1.1);
}
.card-full-delete-btn {
  margin-top: 10px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ff8a8a;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.card-full-delete-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}
</style>
