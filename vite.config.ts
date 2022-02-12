import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Layouts from 'vite-plugin-vue-layouts'

import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import { visualizer } from 'rollup-plugin-visualizer'
import { globalResolver } from './vite/globalVars'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      exclude: ['**/components/*.vue', '**/*.ts'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({
      exclude: ['**/components/*.vue', '**/*.ts'],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      resolvers: [globalResolver],
    }),

    // https://github.com/windicss/windicss
    WindiCSS({
      config: {
        attributify: true,
      },
    }),

    // https://github.com/antfu/vite-plugin-optimize-persist
    PkgConfig(),
    OptimizationPersist(),

    ...extraPlugin(mode),
  ],
}))

function extraPlugin(mode: string) {
  switch (mode) {
    case 'analyze':
      return [visualizer({ open: true })]

    default:
      break
  }

  return []
}
