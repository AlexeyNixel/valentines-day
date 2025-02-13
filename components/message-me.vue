<script setup lang="ts">
const newMessage = ref('');
const messageStore = useMessagesStore()


// Функция для добавления нового сообщения
const sendMessage = async (text:string) => {
  const response = await $fetch('/api/messages', {
    method: 'POST',
    body: { text },
  });

  messageStore.clearCurrentEvent()
};

</script>


<template>
  <div class="flex items-center justify-center flex-col">
    <div class="max-w-lg mx-auto bg-pink-50 p-8 rounded-3xl shadow-2xl">
      <h2 class="text-3xl font-bold text-center text-pink-600 mb-6">
        💌 Напиши милое сообщение на 14 февраля! 💖
      </h2>
      <form @submit.prevent="sendMessage(newMessage)" class="space-y-6">
      <textarea
          v-model="newMessage"
          placeholder="Напиши что-то милое... 😘"
          rows="4"
          class="w-full p-4 border-2 border-pink-300 rounded-xl text-gray-800 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 ease-in-out"
          required
      ></textarea>
        <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Отправить 💌
        </button>
      </form>
    </div>

  </div>

</template>

<style scoped>

</style>