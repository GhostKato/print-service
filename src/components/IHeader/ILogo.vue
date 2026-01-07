<template>
  <div class="logo-wrapper">
    <div class="gradient-bg"></div>
    <img :src="logo" alt="Logo" class="logo" />
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo.png'
</script>

<style scoped>
.logo-wrapper {
  position: relative;
  display: inline-block;
}

.gradient-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 45%;
  height: 90%;
  background: linear-gradient(
    90deg,
    #000 0%,
    #111 10%,
    #222 20%,
    #444 30%,
    #fff 40%,
    #444 50%,
    #222 60%,
    #111 70%,
    #000 80%,
    #000 100%
  );
  background-size: 300% 100%;
  animation: gradientMove 5s linear infinite alternate;
  z-index: 0;
  border-radius: 8px;
  filter: brightness(1.2);
}

.logo {
  width: 200px;
  height: auto;
  position: relative;
  z-index: 1;
  display: block;
}

@media (min-width: 1024px) {
  .logo {
    width: 250px;
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
@media (min-width: 1920px) {
  .logo-wrapper {
    margin-right: 220px;
  }
}
@media (min-width: 2560px) {
  .logo-wrapper {
    margin-right: 250px;
  }
}
</style>
