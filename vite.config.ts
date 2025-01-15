/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { readdir } from 'node:fs/promises'
import dts from 'vite-plugin-dts'
import uno from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    uno(),
    //@ts-ignore
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: await getEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
    },
  },
  // @ts-ignore
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
