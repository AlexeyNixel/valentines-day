<template>
  <div class="flex flex-col items-center justify-center font-[Montserrat]">
    <h1 class="mb-4 text-2xl md:text-4xl font-bold text-pink-800">
      С днем святого Валентина!
    </h1>
    <canvas ref="canvas" class="relative border-2 border-pink-300"></canvas>

    Модальное окно
    <div
      class="absolute w-[90%] top-2 md:w-[500px] rounded-xl bg-white p-3 text-md text-black shadow-2xl overscroll-y-auto"
      v-if="!gameRunning"
    >
      <!--      Игра не пройдена-->
      <div v-if="!gameWin">
        <h1 class="text-center mb-4 text-xl font-bold">Условия</h1>
        <p class="mb-3">Собери <b>30</b> сердец что бы пройти дальше.</p>
        <p class="mb-3">
          Соберешь <b>50</b> будет <b>бонус</b>, но на многое не рассчитывай, не
          можешь набрать пиши мне, скажу как взломать
        </p>
      </div>

      <!--Игра пройдена 30 очков-->
      <div v-if="gameWin">
        <h1 class="text-center mb-2 text-xl font-bold">Поздравляю</h1>
        <p class="mb-3">
          Молодец, умничка! Пальчики, видимо, часто разминаешь. Как ты это
          делаешь, меня не интересует... Ладно, интересует, но не будем об этом.
        </p>
        <p class="mb-3" v-if="!isEasterEgg">
          Наберешь <b>50</b> очков получишь доступ к <b>бонусу</b> но все не так
          просто.
        </p>
      </div>

      <!--Игра пройдена 50 очков-->
      <div v-if="isEasterEgg">
        <p class="mb-3">
          Ты смогла, я тебя поздравляю, рад что ты захотела попасть в секретную
          локацию.
        </p>
        <p class="mb-3">Что бы туда попасть необходимо ввести пароль.</p>
        <p class="mb-4 text-md text-orange-500">
          пароль для активации бонуса найдешь в телеграме 4 февраля 2025 года в
          2:44
        </p>
        <UInput
          @keydown.enter="handleActivateEasterEgg"
          class="w-full mb-4"
          placeholder="Ввести пароль"
          v-model="password"
          color="error"
        />
        <p v-if="myStore.isBonus" class="mb-4 text-green-500">
          Бонус активирован
        </p>
      </div>

      <div class="">
        <div class="flex justify-between mb-2">
          <UButton
            color="success"
            class="justify-center w-full rounded-xl"
            @click="startGame"
            >Новая игра</UButton
          >
          <UButton
            v-if="gameWin"
            color="success"
            class="justify-center w-full rounded-xl ml-2"
            @click="handleNextPage"
            >Продолжить</UButton
          >
        </div>

        <UButton
          color="error"
          class="justify-center w-full rounded-xl"
          @click="handleActivateBonusPage"
          v-if="isEasterEggActivate"
        >
          Активировать бонус
        </UButton>
      </div>
    </div>

    <div class="mt-4 text-xl text-pink-800">
      <span class="font-bold"> Собранные сердца: {{ score }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MyButton from '~/components/my-button.vue';

const canvas = ref(null);
const ctx = ref(null);
const snake = ref([{ x: 10, y: 10 }]);
const direction = ref({ x: 1, y: 0 });
const food = ref({ x: 5, y: 5 });
const gridSize = 20;
const tileCount = 20;
const collectedLetters = ref('');

const gameRunning = ref(false);
const score = ref(0);
const gameWin = ref(false);
const isEasterEgg = ref(false);
const isEasterEggActivate = ref(false);

const myStore = useMyIndexStore();
const messageStore = useMessagesStore();

const password = ref('');

const startGame = () => {
  gameRunning.value = true;
  resetGame();
  gameLoop();
};

const resetGame = () => {
  snake.value = [{ x: 10, y: 10 }];
  gameWin.value = false;
  direction.value = { x: 1, y: 0 };
  collectedLetters.value = '';
  placeFood();
};

const placeFood = () => {
  food.value = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
};

const gameLoop = () => {
  if (!gameRunning.value) return;

  update();
  draw();

  // Сделаем скорость игры плавной, уменьшив задержку
  setTimeout(() => gameLoop(), 120); // Уменьшено с 100 до 75 для плавности
};

const update = () => {
  // Обновляем координаты головы змейки
  const head = {
    x: snake.value[0].x + direction.value.x,
    y: snake.value[0].y + direction.value.y,
  };

  // Проверка на столкновение с границами или с собой
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    collision(head, snake.value)
  ) {
    gameRunning.value = false;
    gameWin.value = score.value >= 30;
    isEasterEgg.value = score.value >= 50;
    myStore.isSnake = score.value >= 30;
    return;
  }

  // Добавляем новую голову в начало змейки
  snake.value.unshift(head);

  // Проверка на сбор пищи
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value++;
    placeFood(); // Появляется новая еда
  } else {
    snake.value.pop(); // Удаляем хвост, если не съели еду
  }
};

const handleActivateEasterEgg = () => {
  if (password.value === 'ДаринаСамаяКрутая123') {
    isEasterEggActivate.value = true;
  }
};

const handleActivateBonusPage = () => {
  myStore.isBonus = true;
  const audio = new Audio('/bonus-activate.mp3');
  audio.volume = 0.3;
  audio.play();
};

const handleNextPage = () => {
  messageStore.clearCurrentEvent();

  if (myStore.isBonus) {
    messageStore.setCurrentEvent('bonus');
  }
};

const draw = () => {
  // Очистка экрана
  ctx.value.fillStyle = 'rgb(255, 223, 223)';
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

  // Рисуем сетку
  drawGrid();

  // Рисуем еду (смайлик сердца)
  ctx.value.font = `${gridSize}px Arial`;
  ctx.value.textAlign = 'center';
  ctx.value.textBaseline = 'middle';
  ctx.value.fillText(
    '❤️',
    food.value.x * gridSize + gridSize / 2,
    food.value.y * gridSize + gridSize / 2
  );

  // Рисуем змейку с градиентом
  snake.value.forEach((part, index) => {
    // Создаем градиент для каждого сегмента
    const gradient = ctx.value.createLinearGradient(0, 0, gridSize, gridSize);
    gradient.addColorStop(0, `hsl(${(index * 15) % 360}, 100%, 50%)`); // Плавное изменение цвета по ходу змейки
    gradient.addColorStop(1, `hsl(${(index * 15 + 60) % 360}, 100%, 50%)`);

    ctx.value.fillStyle = gradient;
    ctx.value.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );
  });
};

// Функция для рисования сетки
const drawGrid = () => {
  ctx.value.strokeStyle = '#ddd'; // Цвет линии сетки
  ctx.value.lineWidth = 0.5;

  for (let i = 0; i < tileCount; i++) {
    ctx.value.beginPath();
    ctx.value.moveTo(i * gridSize, 0);
    ctx.value.lineTo(i * gridSize, canvas.value.height);
    ctx.value.stroke();
    ctx.value.beginPath();
    ctx.value.moveTo(0, i * gridSize);
    ctx.value.lineTo(canvas.value.width, i * gridSize);
    ctx.value.stroke();
  }
};

const collision = (head, array) => {
  return array.some((part) => part.x === head.x && part.y === head.y);
};

// Обработка свайпов
let startX = 0;
let startY = 0;

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
};

const handleTouchMove = (e) => {
  e.preventDefault(); // Чтобы не скроллился экран
};

const handleTouchEnd = (e) => {
  const touch = e.changedTouches[0];
  const endX = touch.clientX;
  const endY = touch.clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  // Определение направления свайпа
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      if (direction.value.x === 0) direction.value = { x: 1, y: 0 }; // Вправо
    } else {
      if (direction.value.x === 0) direction.value = { x: -1, y: 0 }; // Влево
    }
  } else {
    if (diffY > 0) {
      if (direction.value.y === 0) direction.value = { x: 0, y: 1 }; // Вниз
    } else {
      if (direction.value.y === 0) direction.value = { x: 0, y: -1 }; // Вверх
    }
  }
};

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  canvas.value.width = gridSize * tileCount;
  canvas.value.height = gridSize * tileCount;

  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.value.y === 0) direction.value = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.value.y === 0) direction.value = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.value.x === 0) direction.value = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.value.x === 0) direction.value = { x: 1, y: 0 };
        break;
    }
  });

  // Добавление обработчиков для мобильных устройств
  canvas.value.addEventListener('touchstart', handleTouchStart);
  canvas.value.addEventListener('touchmove', handleTouchMove, {
    passive: false,
  });
  canvas.value.addEventListener('touchend', handleTouchEnd);
});

onBeforeUnmount(() => {
  // Удаляем обработчики событий при размонтировании компонента
  canvas.value.removeEventListener('touchstart', handleTouchStart);
  canvas.value.removeEventListener('touchmove', handleTouchMove);
  canvas.value.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped>
canvas {
  background-color: rgb(255, 223, 223);
}
</style>
