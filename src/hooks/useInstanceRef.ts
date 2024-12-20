import { ref } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

export function useInstanceRef<T>(component: T) {
  return ref<ComponentExposed<T>>()
}
