import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  target: 'static', // Убедитесь, что используешь статическую генерацию
  app: {
    baseURL: '/', // Это важно для правильной работы GitHub Pages
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    vue: {
      script: {
        defineModel: true,
      },
    },
  },
});
