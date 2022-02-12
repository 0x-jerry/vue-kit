import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { globalResolver } from './vite/globalVars'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    lib: {
      entry: path.resolve('src/lib.ts'),
      formats: ['umd'],
      name: '[name].js',
      fileName: 'vue-kit',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [
    Vue(),

    Icons(),

    // https://github.com/windicss/windicss
    WindiCSS({
      config: {
        attributify: true,
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      resolvers: [globalResolver],
    }),
  ],
}))
