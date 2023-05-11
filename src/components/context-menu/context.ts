import { type InjectionKey } from 'vue'

export const KContextMenuContextKey = Symbol('k-context-menu') as InjectionKey<KContextMenuContext>

export interface KContextMenuContext {
  close(): void
}

export function useContextMenuContext() {
  return inject(KContextMenuContextKey)
}
