import { inject, provide, type InjectionKey } from 'vue'

export interface DefineContext<Options extends unknown[], Context> {
  (): Context | null
  (defaultValue: Context): Context

  provide(...arg: Options): Context
}

export function defineContext<T extends {}>(key: InjectionKey<T>): DefineContext<[T], T>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function defineContext<F extends (...args: any[]) => unknown>(
  key: string | symbol | InjectionKey<ReturnType<F>>,
  factory: F,
): DefineContext<Parameters<F>, ReturnType<F>>

// implementation
export function defineContext<Fn extends (...args: unknown[]) => unknown>(
  key: string | symbol | InjectionKey<unknown>,
  factory?: Fn,
) {
  const useContext = (defaultContext: unknown) => {
    const ctx = inject(key, defaultContext)

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
