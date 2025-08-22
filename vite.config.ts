/// <reference types="vitest/config" />

import { readdir } from 'node:fs/promises'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import uno from 'unocss/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), vueJsx(), uno(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: await getEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})

async function getEntries() {
  const entries: Record<string, string> = {
    index: 'src/lib.ts',
  }

  const componentDir = 'src/components'
  const files = await readdir(componentDir)

  for (const name of files) {
    entries[`components/${name}`] = `${componentDir}/${name}/index.ts`
  }

  return entries
}
