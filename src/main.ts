import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/normalize.css'
import './lib'

const app = createApp(App)

// install all modules
Object.values(import.meta.globEager('./modules/*.ts')).forEach((m) => {
  m.install(app)
})

app.mount('#app')
