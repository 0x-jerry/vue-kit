import type { Fn } from '@0x-jerry/utils'
import { type InjectionKey, inject, provide } from 'vue'

export interface DefineStricutContext<Options extends unknown[], Context> {
  (): Context
  (defaultValue: Context): Context

  provide(...arg: Options): Context
}

export function defineStrictContext<T extends {}>(
  key: InjectionKey<T>,
): DefineStricutContext<[T], T>
// biome-ignore lint/suspicious/noExplicitAny: hack types
export function defineStrictContext<F extends (...args: any[]) => unknown>(
  key: string | symbol | InjectionKey<ReturnType<F>>,
  factory: F,
): DefineStricutContext<Parameters<F>, ReturnType<F>>

// implementation
export function defineStrictContext(key: string | symbol | InjectionKey<unknown>, factory?: Fn) {
  const useContext = (defaultContext: unknown) => {
    const ctx = inject(key, defaultContext)

    if (!ctx) {
      throw new Error(`Can not find context key: ${key.toString()}`)
    }

    return ctx
  }

  useContext.provide = getProviderFn()

  return useContext

  function getProviderFn() {
    if (typeof factory === 'function') {
      return (...args: unknown[]) => {
        const ctx = factory(...args)

        provide(key, ctx)

        return ctx
      }
    }

    return (value: unknown) => {
      provide(key, value)

      return value
    }
  }
}
