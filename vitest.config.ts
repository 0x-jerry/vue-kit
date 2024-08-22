import { defineConfig } from 'vitest/config'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => ({
  plugins: [vue(), vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))
