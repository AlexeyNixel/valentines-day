import { globalMessages } from '~/constants/global-messages';

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([...globalMessages]);
  const currentIndex = ref(34);
  const currentMessage = computed(() => messages.value[currentIndex.value]);

  const messagesIsMissing = computed(
    () => messages.value.length <= currentIndex.value
  );

  const clearCurrentEvent = () => {
    messages.value[currentIndex.value].conditional = null;
  };

  const setCurrentEvent = (event: string) => {
    messages.value[currentIndex.value].conditional = event;
  };

  return {
    messages,
    currentIndex,
    currentMessage,
    clearCurrentEvent,
    setCurrentEvent,
    messagesIsMissing,
  };
});
