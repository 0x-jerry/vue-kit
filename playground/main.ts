import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors.mjs'

import App from './src/App.vue'
import { registerAllFormComponents } from './src/form'

import 'normalize.css'
import 'uno.css'

registerAllFormComponents()

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: colors.teal.base,
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  //
  .use(vuetify)
  .mount('#app')
