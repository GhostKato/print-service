import { defineStore } from 'pinia'
import { i18n } from '@/i18n'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    lang: (localStorage.getItem('lang') as 'en' | 'uk' | 'ru') || 'uk',
  }),
  actions: {
    setLanguage(newLang: 'en' | 'uk' | 'ru') {
      this.lang = newLang
      localStorage.setItem('lang', newLang)
      i18n.global.locale.value = newLang
    },
  },
  getters: {
    isEnglish: (state) => state.lang === 'en',
    isUkrainian: (state) => state.lang === 'uk',
    isRussian: (state) => state.lang === 'ru',
  },
})
