import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ModalName = 'auth' | 'menu' | 'chat' | 'card'

type ModalsState = Record<ModalName, boolean>

export const useModalStore = defineStore('modal', () => {
  const modals = ref<ModalsState>({
    auth: false,
    menu: false,
    chat: false,
    card: false,
  })

  function open(name: ModalName) {
    modals.value[name] = true
  }

  function close(name: ModalName) {
    modals.value[name] = false
  }

  function closeAll() {
    ;(Object.keys(modals.value) as ModalName[]).forEach((key) => {
      modals.value[key] = false
    })
  }

  function toggle(name: ModalName) {
    modals.value[name] = !modals.value[name]
  }

  return { modals, open, close, closeAll, toggle }
})
