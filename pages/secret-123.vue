<script setup lang="ts">
const fetchMessages = async () => {
  const response = await $fetch('/api/messages');
  console.log(response);  // Выведет все сообщения
};
</script>

<template>
  <div>
    <UButton @click="fetchMessages">Получить ответы</UButton>
  </div>
</template>

<style scoped>

</style>