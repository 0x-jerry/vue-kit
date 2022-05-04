import { InjectionKey } from 'vue'

export const ConfProviderContextKey = Symbol() as InjectionKey<ConfProviderContext>

export interface ConfProviderContext {
  notify?: {}
}
