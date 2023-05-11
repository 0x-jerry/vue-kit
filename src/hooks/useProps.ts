import type { ExtractPropTypes } from 'vue'
import type { ComponentInternalInstance, ComputedRef } from 'vue'

export const useProps = <T extends {}>(
  vm?: ComponentInternalInstance,
): (T extends ExtractPropTypes<infer _> ? T : ExtractPropTypes<T>) | undefined => {
  vm ||= getCurrentInstance()!

  return vm.proxy?.$props as any
}

export const useProp = <T>(
  name: string,
  vm: ComponentInternalInstance,
): ComputedRef<T | undefined> => {
  vm ||= getCurrentInstance()!

  return computed(() => (vm.proxy?.$props as any)[name] ?? undefined)
}
