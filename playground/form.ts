import InputText from 'primevue/inputtext'
import { FormConfig, registerComponent } from '../src/components/v-form/configs'
import FormItem from './FormItem.vue'

export function registerAllFormComponents() {
  registerComponent('Input', InputText)
  FormConfig.FieldItem = FormItem
}
