<template>
  <div
    class="text-[300px] h-[80%] flex items-center justify-center select-none"
  >
    {{
      messagesStore.currentMessage.emotions
        ? messagesStore.currentMessage.emotions
        : '❤️'
    }}
  </div>
</template>

<script lang="ts" setup>
const messagesStore = useMessagesStore();
</script>

<style></style>
