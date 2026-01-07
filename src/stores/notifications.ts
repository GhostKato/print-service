import { reactive } from 'vue'

type NotificationItem = {
  message: string
  type: 'success' | 'info' | 'added' | 'removed' | 'error'
  icon?: string
  duration?: number
}

export const notificationStore = reactive({
  list: [] as Array<NotificationItem & { id: number }>,

  pushNotification(notification: NotificationItem) {
    const id = Date.now()
    this.list.push({ id, ...notification })

    setTimeout(() => this.removeNotification(id), notification.duration ?? 3000)
  },

  removeNotification(id: number) {
    const index = this.list.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  },

  success(message: string, duration?: number) {
    this.pushNotification({
      message,
      type: 'success',
      icon: '✔',
      duration,
    })
  },

  info(message: string, duration: number = 12000) {
    this.pushNotification({
      message,
      type: 'info',
      icon: 'ℹ',
      duration,
    })
  },

  added(message: string, duration?: number) {
    this.pushNotification({
      message,
      type: 'added',
      icon: '+',
      duration,
    })
  },

  removed(message: string, duration?: number) {
    this.pushNotification({
      message,
      type: 'removed',
      icon: '−',
      duration,
    })
  },

  error(message: string, duration?: number) {
    this.pushNotification({
      message,
      type: 'error',
      icon: '❌',
      duration,
    })
  },
})
