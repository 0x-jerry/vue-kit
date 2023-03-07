import { createApp, Plugin } from 'vue'
import App from './App.vue'

import '@unocss/reset/normalize.css'
import 'uno.css'
import './theme/index.less'
// import './theme/components/button.less'

const app = createApp(App)

// install all modules
Object.values(import.meta.glob<Plugin>('./modules/*.ts', { eager: true }))
  //
  .forEach((m) => app.use(m))

app.mount('#app')
