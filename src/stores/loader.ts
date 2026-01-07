import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    isLoading: false,
    isGlobalLoading: false,
  }),
  actions: {
    showLoader() {
      this.isLoading = true
    },
    hideLoader() {
      this.isLoading = false
    },

    showGlobalLoader() {
      this.isGlobalLoading = true
      this.isLoading = true
    },

    hideGlobalLoader() {
      this.isGlobalLoading = false
      this.isLoading = false
    },
  },
})
