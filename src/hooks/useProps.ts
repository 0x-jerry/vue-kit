import type { GetPropsType } from '@/utils'
import type { ComponentInternalInstance, ComputedRef } from 'vue'

export const useProps = <T extends {}>(
  vm?: ComponentInternalInstance,
): (T extends GetPropsType<infer _> ? T : GetPropsType<T>) | undefined => {
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
