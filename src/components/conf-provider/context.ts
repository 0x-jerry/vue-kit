import { type InjectionKey } from 'vue'
import { type ConfProviderPropType } from './props'

export const ConfProviderContextKey = Symbol() as InjectionKey<ConfProviderContext>

export type ConfProviderContext = ConfProviderPropType

export function useConfProvider() {
  return inject(ConfProviderContextKey, null)
}
