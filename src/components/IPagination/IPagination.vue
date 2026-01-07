<template>
  <div class="pagination" v-if="totalPages > 1">
    <IButton variant="pagination-btn" @click="prev" :disabled="currentPage === 1">
      {{ $t('pagination.previous') }}
    </IButton>

    <div class="pages-list">
      <button
        v-for="(page, index) in visiblePages"
        :key="index"
        :class="['page-item', { active: page === currentPage, dots: page === '...' }]"
        :disabled="page === '...'"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <IButton variant="pagination-btn" @click="next" :disabled="currentPage === totalPages">
      {{ $t('pagination.next') }}
    </IButton>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import IButton from '@/components/IButton/IButton.vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const range = 3

  pages.push(1)

  let start = props.currentPage - range
  let end = props.currentPage + range

  if (start <= 1) {
    const extraRight = 2 - start
    end += extraRight
    start = 2
  }

  end = Math.min(props.totalPages, end)

  if (start > 2) {
    pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1) {
      pages.push(i)
    }
  }

  return pages
})

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    emit('update:page', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prev = () => {
  if (props.currentPage > 1) goToPage(props.currentPage - 1)
}

const next = () => {
  if (props.currentPage < props.totalPages) goToPage(props.currentPage + 1)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    modalStore.closeAll()
    next()
  }
  if (e.key === 'ArrowLeft') {
    modalStore.closeAll()
    prev()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}
.pages-list {
  display: flex;
  gap: 5px;
}
.page-item {
  min-width: 40px;
  height: 35px;
  background-color: var(--color-dark-grey);
  color: var(--color-white);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}
.page-item:hover:not(.dots):not(.active) {
  background-color: var(--color-hover);
}
.page-item.active {
  background-color: var(--color-red);
  color: var(--color-white);
  font-weight: bold;
  border-color: var(--color-red);
  cursor: default;
}
@media (max-width: 767px) {
  .pages-list {
    display: none;
  }
}
@media (max-width: 1279px) {
  .pagination {
    padding-top: 10px;
    padding-bottom: 20px;
  }
}
@media (min-width: 1024px) {
  .page-item {
    height: 39px;
    font-size: 20px;
  }
}
@media (min-width: 1920px) {
  .pagination {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -72px;
  }
}
@media (min-width: 2560px) {
  .pagination {
    bottom: -130px;
  }
}
</style>