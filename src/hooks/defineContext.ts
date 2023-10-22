import { inject, provide, type InjectionKey } from 'vue'

export interface DefineContext<Options extends any[], Context> {
  (): Context | null
  (defaultValue: Context): Context

  provide(...arg: Options): Context
}

export function defineContext<T extends {}>(key: InjectionKey<T>): DefineContext<[T], T>
export function defineContext<T extends (...args: any[]) => any>(
  key: string | symbol | InjectionKey<any>,
  factory: T,
): DefineContext<Parameters<T>, ReturnType<T>>

// implement
export function defineContext<Fn extends (...args: any[]) => any>(
  key: string | symbol | InjectionKey<any>,
  factory?: Fn,
) {
  const useContext = (defaultContext: any) => {
    const ctx = inject(key, defaultContext)

    return ctx
  }

  useContext.provide = getProviderFn()

  return useContext

  function getProviderFn() {
    if (typeof factory === 'function') {
      return (...args: any) => {
        const ctx = factory(...args)

        provide(key, ctx)

        return ctx
      }
    } else {
      return (value: any) => {
        provide(key, value)

        return value
      }
    }
  }
}
