import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import uno from 'unocss/vite'
import router from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

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
