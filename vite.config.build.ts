import { defineConfig } from 'vite'
import path from 'path'
import { sharedConfig } from './vite.config'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: './',
  build: {
    lib: {
      entry: path.resolve('src/lib.ts'),
      formats: ['es'],
      name: '[name].[format].js',
      fileName: 'vue-kit',
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@vueuse/core'],
    },
  },
  ...sharedConfig,
}))
