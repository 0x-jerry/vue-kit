import { shallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

export function useInstanceRef<T>(component: T) {
  return shallowRef<ComponentExposed<T>>()
}
