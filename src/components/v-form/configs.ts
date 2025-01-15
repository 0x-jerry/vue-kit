import type { Component } from 'vue'
import { VLayout } from '../v-layout'
import FieldItem from './FieldItem.vue'

export const FormConfig: IFormGlobalConfig = {
  FormLayout: VLayout,
  Components: [],
  FieldItem,
}

export interface IFormGlobalConfig {
  FormLayout: Component
  FieldItem: Component
  Components: IFormComponent[]
}

export interface IFormComponent {
  name: string
  Ctor: Component
}

export function resolveRegisteredComponent(name?: string) {
  return FormConfig.Components.find((n) => n.name === name)
}

export function registerComponent(name: string, Ctor: Component) {
  const hit = FormConfig.Components.find((n) => n.name === name)

  if (hit) {
    console.warn(`Component ${name} has registered, this will ignored`)
    return
  }

  FormConfig.Components.push({
    name,
    Ctor,
  })
}

export function unregisterComponent(name: string) {
  const idx = FormConfig.Components.findIndex((n) => n.name === name)

  if (idx >= 0) {
    FormConfig.Components.splice(idx, 1)
  }
}
