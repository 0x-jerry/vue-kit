import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import uno from 'unocss/vite'
import router from 'unplugin-vue-router/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    router({
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
    vueJsx(),
    uno(),
  ],
  resolve: {
    alias: {
      '@0x-jerry/vue-kit': path.resolve('../src'),
    },
  },
})
