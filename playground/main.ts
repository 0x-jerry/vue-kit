import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { registerAllFormComponents } from './form'

registerAllFormComponents()

createApp(App)
  .use(PrimeVue, {
    theme: { preset: Aura },
  })
  .mount('#app')
