import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import Unocss from 'unocss/vite'

export const sharedConfig = {
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),

    Icons(),

    // https://github.com/unocss/unocss
    Unocss(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: ['vue', 'vue-router', '@vueuse/core'],
    }),
  ],
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: './',
  resolve: sharedConfig.resolve,
  plugins: [
    ...sharedConfig.plugins,
    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: 'src/auto-components.d.ts',
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      exclude: ['**/components/*.vue', '**/*.ts'],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      extension: ['.ts'],
      reporter: ['clover', 'html-spa'],
    },
  },
}))
