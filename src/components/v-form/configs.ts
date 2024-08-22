import type { Component } from 'vue'
import VFormField from './VFormField.vue'
import { VLayout } from '../v-layout'

export const FormConfig: IFormConfig = {
  FormField: VFormField,
  FormLayout: VLayout,
  Components: []
}

export interface IFormConfig {
  FormField: Component
  FormLayout: Component
  Components: IFormComponent[]
}

export interface IFormComponent {
  name: string
  Ctor: Component
}

export function getComponent(name: string) {
  return FormConfig.Components.find(n => n.name === name)
}

export function registerComponent(name: string, Ctor: Component) {
  const hit = FormConfig.Components.find(n => n.name === name)

  if (hit) {
    console.warn(`Component ${name} has registered, this will ignored`)
    return
  }

  FormConfig.Components.push({
    name,
    Ctor
  })
}

export function removeComponent(name: string) {
  const idx = FormConfig.Components.findIndex(n => n.name === name)

  if (idx >= 0) {
    FormConfig.Components.splice(idx, 1)
  }
}