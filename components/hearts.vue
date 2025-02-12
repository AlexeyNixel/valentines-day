<template>
  <div
    class="pointer-events-none fixed top-0 left-0 h-full w-full overflow-hidden select-none"
  >
    <div
      v-for="heart in hearts"
      :key="heart.id"
      :style="heart.style"
      class="heart absolute -bottom-12"
    >
      <img src="/heart.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const hearts = ref([]);
let heartId = 0;

const createHearts = () => {
  setInterval(() => {
    const size = Math.random() * 24 + 60;
    const id = heartId++;
    const heart = {
      id,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        width: `${size}px`,
      },
    };
    hearts.value.push(heart);

    setTimeout(() => {
      hearts.value = hearts.value.filter((h) => h.id !== id);
    }, 5000);
  }, 200);
};

onMounted(() => {
  createHearts();
});
</script>

<style scoped>
.heart {
  animation: floatUp linear forwards;
}

@keyframes floatUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
</style>
