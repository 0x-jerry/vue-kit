import { ref } from 'vue'

export function useInstanceRef<T extends new (...args: unknown[]) => unknown>(component: T) {
  return ref<InstanceType<T>>()
}
