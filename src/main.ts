import { createApp, Plugin } from 'vue'
import App from './App.vue'

import './lib'

const app = createApp(App)

// install all modules
Object.values(import.meta.glob<Plugin>('./modules/*.ts', { eager: true })).forEach((m) => {
  m.install?.(app)
})

app.mount('#app')
