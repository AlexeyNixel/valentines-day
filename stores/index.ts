import { Placeholder } from '#components';
import { defineStore } from 'pinia';

export const useMyIndexStore = defineStore('index', () => {
  const currentComponent = ref('placeholder');
  const isSnake = ref(false);
  const isBonus = ref(false);
  const isSmart = ref(false);

  return {
    currentComponent,
    isSnake,
    isBonus,
    isSmart,
  };
});
