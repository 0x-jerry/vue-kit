import type { Component } from 'vue'
import VFormField from './VFormField.vue'
import { VLayout } from '../v-layout'

export const FormConfig: IFormConfig = {
  FormField: VFormField,
  FormLayout: VLayout,
}

export interface IFormConfig {
  FormField: Component
  FormLayout: Component
}
