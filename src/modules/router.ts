import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import { Plugin } from 'vue'

export const install: Plugin = (app) => {
  const routes = setupLayouts(generatedRoutes)

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(router)
}
