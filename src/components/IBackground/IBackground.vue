<template>
  <div class="background">
    <div class="bubbles-container">
      <div
        v-for="n in 20"
        :key="n"
        class="bubble"
        :style="generateBubbleStyle(n)"
      ></div>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

const generateBubbleStyle = (index: number) => {
  const size = Math.random() * 40 + 10 + 'px';
  const left = Math.random() * 100 + '%';
  const delay = Math.random() * 5 + 's';
  const duration = Math.random() * 10 + 5 + 's';

  return {
    width: size,
    height: size,
    left: left,
    animationDelay: delay,
    animationDuration: duration
  };
};
</script>

<style scoped>
.background {
  width: 100%;
  height: 80vh;
  background: linear-gradient(180deg, #000000 0%, #330000 50%, #000000 100%);
  position: relative;
  overflow: hidden;
}
.bubbles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}
.bubble {
  position: absolute;
  bottom: -60px;
  background: rgba(255, 100, 100, 0.15);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.1);
  animation: flyUp linear infinite;
  pointer-events: none;
}
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
    transform: translateY(-90vh) translateX(30px);
    opacity: 0;
  }
}
.content {
  position: relative;
  z-index: 2;
  height: 100%;
}
</style>
