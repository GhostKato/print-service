<template>
  <div class="media-list">
    <div v-if="contentStore.cards.length === 0" class="empty">
      <p>{{ $t('media_list.not_found') }}</p>
    </div>
    <div v-else class="media-grid">
      <div
        v-for="card in contentStore.cards"
        :key="card.id"
        class="media-card"
        @click="openDetails(card.id)"
      >
        <img :src="card.imageUrl" :alt="card.title" loading="lazy" />

        <div class="info">
          <h3 class="title">{{ card.title }}</h3>
          <p class="type">{{ card.price }} грн</p>

          <button
            v-if="authStore.isStaff"
            class="delete-btn"
            @click.stop="contentStore.deleteContent(card.id, 'cards', card.imageUrl)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'

const contentStore = useContentStore()
const authStore = useAuthStore()

let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = contentStore.initCardsListener()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const openDetails = (id: string) => {
  console.log('Перехід до картки:', id)

}
</script>

<style scoped>

.media-list {
  padding: 20px;
  min-height: 400px;
}
.empty {
  text-align: center;
  color: #fff;
  margin-top: 60px;
  font-size: 1.2rem;
  opacity: 0.7;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.media-card {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: red;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}
.media-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
.media-card:hover img {
  transform: scale(1.05);
}
.info {
  position: absolute;
  inset: 0;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0)
  );
  color: #fff;
}
.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.type {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #4caf50;
}
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  cursor: pointer;
  z-index: 5;
}
.delete-btn:hover {
  background: #dc2626;
}
</style>
