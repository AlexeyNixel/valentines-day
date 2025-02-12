<template>
  <div class="text-white flex items-center justify-center h-full z-50">
    <div class="h-[900px] w-2/3 bg-pink-200 rounded-xl">
      <component class="h-[80%]" :is="components[myStore.currentComponent]" />
      <!--      <valentinka class="h-80%" />-->
      <div class="h-[19%] mx-2 text-black bg-white p-2 rounded-xl">
        <TypingMessages />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Bonus, Placeholder, SmartGame, SnakeGame } from '#components';
import Valentinka from '~/components/valentinka.vue';
import { useMyIndexStore } from '~/stores';

const myStore = useMyIndexStore();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const components: { [key: string]: any } = ref({
  placeholder: Placeholder,
  'snake-game': SnakeGame,
  'smart-game': SmartGame,
  bonus: Bonus,
});
</script>

<style></style>
