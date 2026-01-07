import { watch, onUnmounted } from 'vue'
import { useModalStore } from '@/stores/modal'

export function autoClose(
  modalName: keyof ReturnType<typeof useModalStore>['modals'],
  delay = 10000,
) {
  const modalStore = useModalStore()
  let timer: ReturnType<typeof setTimeout> | null = null

  const startTimer = () => {
    clearTimer()
    timer = setTimeout(() => modalStore.close(modalName), delay)
  }

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  watch(
    () => modalStore.modals[modalName],
    (isOpen) => {
      if (isOpen) startTimer()
      else clearTimer()
    },
  )

  onUnmounted(() => clearTimer())
}
