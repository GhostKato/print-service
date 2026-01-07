<template>
  <transition-group name="pop" tag="div" class="noti-wrapper">
    <div
      v-for="item in notificationStore.list"
      :key="item.id"
      class="noti"
      :class="item.type"
      @click="notificationStore.removeNotification(item.id)"
    >
      <div class="icon">{{ item.icon }}</div>
      <div class="text">{{ item.message }}</div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { notificationStore } from '@/stores/notifications'
</script>

<style scoped>
.noti-wrapper {
  position: fixed;
  bottom: 1.2rem;
  right: 1.2rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.noti {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 15px;
  min-width: 260px;
  max-width: 350px;
  background-color: var(--color-transparent-grey);
  backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--color-grey);
  transform-origin: right center;
  cursor: pointer;
}
.icon {
  font-size: 20px;
  opacity: 0.9;
}
.success {
  box-shadow: 0 0 12px var(--color-shadow-green);
}
.success .icon {
  font-size: 30px;
  color: var(--color-green);
}
.info {
  box-shadow: 0 0 12px var(--color-shadow-blue);
}
.info .icon {
  font-size: 40px;
  color: var(--color-blue);
}
.added {
  box-shadow: 0 0 12px var(--color-shadow-green);
}
.added .icon {
  font-size: 40px;
  font-weight: 900;
  color: var(--color-green);
}
.removed {
  box-shadow: 0 0 12px var(--color-shadow-red);
}
.removed .icon {
  font-size: 40px;
  font-weight: 900;
  color: var(--color-red);
}
.error {
  box-shadow: 0 0 12px var(--color-shadow-red);
  color: var(--color-red);
}
.pop-enter-from {
  opacity: 0;
  transform: translateX(50%) scale(0.8);
}
.pop-enter-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.pop-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(40%) scale(0.95);
}
</style>
