import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Card } from '@/types'

export type ModalName = 'auth' | 'menu' | 'chat' | 'detailsCard' | 'addCard' | 'editCard'

type ModalPayload = Card | null

export const useModalStore = defineStore('modal', () => {
  const modals = ref<Record<ModalName, boolean>>({
    auth: false,
    menu: false,
    chat: false,
    detailsCard: false,
    addCard: false,
    editCard: false,
  })

  const modalData = ref<ModalPayload>(null)

  function open(name: ModalName, data: ModalPayload = null) {
    modalData.value = data
    modals.value[name] = true
  }

  function close(name: ModalName) {
    modals.value[name] = false
    setTimeout(() => {
      if (!Object.values(modals.value).includes(true)) {
        modalData.value = null
      }
    }, 300)
  }

  function closeAll() {
    ;(Object.keys(modals.value) as ModalName[]).forEach((key) => {
      modals.value[key] = false
    })
    modalData.value = null
  }

  function toggle(name: ModalName) {
    modals.value[name] = !modals.value[name]
  }

  return { modals, modalData, open, close, closeAll, toggle }
})
