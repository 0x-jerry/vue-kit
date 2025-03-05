import type { VCheckbox, VSelect, VTextField } from 'vuetify/components'

declare module '../src/components/v-form/types' {
  interface FormComponentMapSetting {
    Input: typeof VTextField
    Checkbox: typeof VCheckbox
    Select: typeof VSelect
  }
}
