import { createApp } from 'vue'
import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config'
import Material from '@primevue/themes/material'
import App from './App.vue'
import { registerAllFormComponents } from './form'

import 'uno.css'

registerAllFormComponents()

const primeConfig: PrimeVueConfiguration = {
  theme: { preset: Material },
  ripple: true,
}

createApp(App).use(PrimeVue, primeConfig).mount('#app')
