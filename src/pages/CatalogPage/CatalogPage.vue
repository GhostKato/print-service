<template>
  <IBackground>
    <div class="container">
      <div class="main-hello" :style="{ opacity: visibilityMainHello ? 1 : 0 }"></div>

      <div class="content-section">
        <template v-if="contentStore.cards.length > 0">
          <CardList />
        </template>

        <div v-else class="empty-state">
          <p>{{ $t('card_list.not_found') }}</p>
        </div>
      </div>
    </div>
  </IBackground>
</template>

<script setup lang="ts">
import IBackground from '@/components/IBackground/IBackground.vue'
import CardList from './components/CardList.vue'
import { ref, onMounted } from 'vue'
import { useCardStore } from '@/stores/card'

const contentStore = useCardStore()

const visibilityMainHello = ref(false)

onMounted(() => {
  contentStore.initCardsListener()

  setTimeout(() => {
    visibilityMainHello.value = true
  }, 1000)
})
</script>

<style scoped>
.container {
  position: relative;
  min-height: calc(100vh - 100px);
  padding-bottom: 50px;
}

.main-hello {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  transition: opacity 2s ease-in-out;
}

.main-title {
  font-size: 25px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.add-btn {
  max-width: 250px;
}

.content-section {
  padding: 0 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  text-align: center;
}

@media (min-width: 768px) {
  .main-title {
    font-size: 35px;
  }
}
</style>
