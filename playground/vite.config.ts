import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import uno from 'unocss/vite'

export default defineConfig({
  plugins: [vue(), vueJsx(), uno()],
  resolve: {
    alias: {
      '@0x-jerry/vue-kit': '../src',
    },
  },
})
