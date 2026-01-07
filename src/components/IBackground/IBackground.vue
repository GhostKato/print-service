<template>
  <div class="background">
    <!-- Декоративний шар з бульбашками -->
    <div class="bubbles-container">
      <div v-for="n in 20" :key="n" class="bubble" :style="generateBubbleStyle(n)" />
    </div>

    <!-- Контент -->
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const generateBubbleStyle = () => {
  const size = Math.random() * 40 + 10 + 'px'
  const left = Math.random() * 100 + '%'
  const delay = Math.random() * 5 + 's'
  const duration = Math.random() * 10 + 5 + 's'

  return {
    width: size,
    height: size,
    left,
    animationDelay: delay,
    animationDuration: duration,
  }
}
</script>

<style scoped>
/* Головний контейнер фону */
.background {
  position: relative;
  width: 100%;
  min-height: 100vh;

  background: linear-gradient(180deg, #000000 0%, #330000 50%, #000000 100%);
}

/* Декоративний шар */
.bubbles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

/* Бульбашки */
.bubble {
  position: absolute;
  bottom: -60px;

  background: rgba(255, 100, 100, 0.15);
  border-radius: 50%;
  box-shadow:
    0 0 15px rgba(255, 0, 0, 0.2),
    inset 0 0 10px rgba(255, 255, 255, 0.1);

  animation-name: flyUp;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Анімація */
@keyframes flyUp {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-120vh) translateX(30px);
    opacity: 0;
  }
}

/* Контент */
.content {
  position: relative;
  z-index: 2;
  padding-bottom: 40px;
}
</style>
