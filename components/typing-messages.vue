<template>
  <div
    class="font-[Pacifico] text-xl md:text-2xl w-full h-full select-none"
    @click="handleMouseClick"
  >
    Лёша: {{ displayedText }}
  </div>
</template>

<script lang="ts" setup>
const myStore = useMyIndexStore();
const messageStore = useMessagesStore();
const { messages } = storeToRefs(messageStore);
const { currentIndex } = storeToRefs(messageStore);

const typingSpeed = ref(0.1);

const displayedText = ref('');

const isTyping = ref(false);

onMounted(() => {
  handleMouseClick();
});

const typingText = () => {
  const currentWord = messages.value[currentIndex.value].text;
  const currentEvent = messages.value[currentIndex.value].conditional;
  let charIdx = 0;

  isTyping.value = true;

  if (currentEvent) {
    isTyping.value = false;
    myStore.currentComponent = currentEvent;
    return;
  } else {
    myStore.currentComponent = 'placeholder';
  }

  const interval = setInterval(() => {
    displayedText.value += currentWord[charIdx++];

    if (charIdx >= currentWord.length) {
      clearInterval(interval);
      isTyping.value = false;
    }
  }, typingSpeed.value);
};

const eraseText = () => {
  isTyping.value = true;

  const erasingInterval = setInterval(() => {
    displayedText.value = displayedText.value.slice(0, -1);

    if (displayedText.value.length === 0) {
      clearInterval(erasingInterval);
      console.log('delete');
      isTyping.value = false;
      currentIndex.value++;

      if (messages.value[currentIndex.value]) {
        typingText();
      }
    }
  }, typingSpeed.value);
};

const handleMouseClick = () => {
  if (messages.value[currentIndex.value].text) {
    if (isTyping.value) {
      return;
    }

    if (displayedText.value === messages.value[currentIndex.value].text) {
      eraseText();
    } else {
      typingText();
    }
  }
};

watch(
  messages,
  () => {
    handleMouseClick();
  },
  { deep: true }
);
</script>

<style></style>
