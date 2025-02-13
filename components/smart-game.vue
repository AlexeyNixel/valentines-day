<template>
  <div class="relative flex flex-col items-center justify-center p-4">
    <p class="mb-5 text-black font-[Pacifico] text-2xl text-center md:text-4xl">
      Я думаю смысл игры понятен найди одинаковые
    </p>
    <div class="grid max-w-4xl grid-cols-4 gap-4">
      <div
        v-for="(card, index) in shuffledCards"
        :key="card.id"
        class="bg-mint flex h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 transform cursor-pointer items-center justify-center rounded-xl shadow-lg transition-all duration-300"
        @click="flipCard(index)"
        :class="{
          'bg-pink': card.flipped || card.matched,
          'bg-love': !card.flipped && !card.matched,
        }"
      >
        <span v-if="card.flipped || card.matched" class="w-full text-3xl">
          <img
            class="h-16 md:h-32 w-full rounded-xl object-cover"
            :src="card.value"
            alt=""
          />
        </span>
        <span v-else class="text-xl">❓</span>
      </div>
    </div>

    <div
      v-if="gameOver"
      class="absolute w-[90%] top-2 md:w-[500px] rounded-xl bg-white p-3 text-md text-black shadow-2xl overscroll-y-auto"
    >
      <h1 class="mb-4 text-xl font-bold">Поздравляю</h1>
      <p class="mb-4 text-black">
        Урааа, красотка, умничка, прошла! Я в шоке, что ты смогла! Ты просто
        гений! ✨💖
      </p>
      <p class="mb-4 text-black">
        Если с памятью у тебя всё в порядке, почему ты так часто забываешь, что
        мне обещаешь, а? 🥺💖
      </p>
      <p class="mb-4 text-black">
        Дальше конец, там ничего грандиозного нет, просто то, на что я потратил
        всю ночь. Надеюсь, тебе понравится то, над чем я так старался! 🥺💖
      </p>
      <p class="mt-2 text-white">Ты нашел все пары!</p>
      <div class="flex justify-between">
        <my-button class="font-[Inter]" @click="startNewGame">
          Играть еще
        </my-button>
        <my-button @click="handleNextPage"> Продолжить </my-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cards = [
  { id: 1, value: '/1.jpg', flipped: false, matched: false },
  { id: 2, value: '/2.jpg', flipped: false, matched: false },
  { id: 4, value: '/3.jpg', flipped: false, matched: false },
  { id: 5, value: '/4.jpg', flipped: false, matched: false },
  { id: 6, value: '/5.jpg', flipped: false, matched: false },
  { id: 7, value: '/6.jpg', flipped: false, matched: false },
  { id: 8, value: '/7.jpg', flipped: false, matched: false },
  { id: 9, value: '/8.jpg', flipped: false, matched: false },
  { id: 10, value: '/1.jpg', flipped: false, matched: false },
  { id: 11, value: '/2.jpg', flipped: false, matched: false },
  { id: 12, value: '/3.jpg', flipped: false, matched: false },
  { id: 13, value: '/4.jpg', flipped: false, matched: false },
  { id: 14, value: '/5.jpg', flipped: false, matched: false },
  { id: 15, value: '/6.jpg', flipped: false, matched: false },
  { id: 16, value: '/7.jpg', flipped: false, matched: false },
  { id: 17, value: '/8.jpg', flipped: false, matched: false },
];

const shuffledCards = ref([]);
const flippedCards = ref([]);
const matchedPairs = ref(0);
const gameOver = ref(false);
const messageStore = useMessagesStore();

// Функция для начала игры
const startNewGame = () => {
  shuffledCards.value = shuffle([...cards]);
  flippedCards.value = [];
  matchedPairs.value = 0;
  gameOver.value = false;

  shuffledCards.value.forEach((card) => {
    card.flipped = false;
    card.matched = false;
  });
};

// Функция для перемешивания карточек
const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Функция для переворота карточки
const flipCard = (index) => {
  const card = shuffledCards.value[index];

  if (card.flipped || card.matched || flippedCards.value.length === 2) return;

  card.flipped = true;
  flippedCards.value.push(index);

  if (flippedCards.value.length === 2) {
    checkForMatch();
  }
};

// Функция для проверки совпадения
const checkForMatch = () => {
  const [firstIndex, secondIndex] = flippedCards.value;

  if (
    shuffledCards.value[firstIndex].value ===
    shuffledCards.value[secondIndex].value
  ) {
    shuffledCards.value[firstIndex].matched = true;
    shuffledCards.value[secondIndex].matched = true;
    matchedPairs.value++;
  }

  setTimeout(() => {
    shuffledCards.value[firstIndex].flipped = false;
    shuffledCards.value[secondIndex].flipped = false;

    flippedCards.value = [];

    // Если все пары найдены
    if (matchedPairs.value === 8) {
      gameOver.value = true;
    }
  }, 1000);
};

const handleNextPage = () => {
  messageStore.clearCurrentEvent();
};

// Запуск игры при монтировании
onMounted(() => {
  startNewGame();
});
</script>

<style scoped>
.bg-mint {
  background-color: #a7f3d0;
}

.bg-pink {
  background-color: #f472b6;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}

.grid {
  grid-template-columns: repeat(4, 1fr);
}
</style>
