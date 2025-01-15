import type InputText from 'primevue/inputtext'

declare module '../src/components/v-form' {
  interface FormComponentMapSetting {
    Input: typeof InputText
  }
}
