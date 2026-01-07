<template>
  <div class="language-switcher">
    <template v-if="isLargeScreen">
      <ISelect :model-value="currentLang" :options="languages" @update:model-value="selectLang" />
    </template>
    <template v-else>
      <IButton
        v-for="langOption in languages"
        :key="langOption.value"
        variant="language-btn"
        :class="{ active: currentLang === langOption.value }"
        @click="selectLang(langOption.value)"
      >
        {{ langOption.label }}
      </IButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useModalStore } from '@/stores/modal'
import IButton from '@/components/IButton/IButton.vue'
import ISelect from '@/components/ISelect/ISelect.vue'

const languageStore = useLanguageStore()
const modalStore = useModalStore()

type LangCode = 'en' | 'uk' | 'ru'

const languages: { label: string; value: LangCode }[] = [
  { value: 'en', label: 'EN' },
  { value: 'uk', label: 'UA' },
  { value: 'ru', label: 'RU' },
]

const currentLang = computed(() => languageStore.lang as LangCode)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const isLargeScreen = computed(() => windowWidth.value >= 1920)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

function selectLang(code: LangCode) {
  languageStore.setLanguage(code)
  if (!isLargeScreen.value) {
    modalStore.close('menu')
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.language-switcher .active {
  background: var(--color-red);
  border: 1px solid var(--color-red);
  font-weight: bold;
}
</style>
