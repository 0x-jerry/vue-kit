import { defineContext } from '@/hooks/defineContext'
import { type InjectionKey } from 'vue'

const KContextMenuContextKey = Symbol('k-context-menu') as InjectionKey<KContextMenuContext>

export interface KContextMenuContext {
  close(): void
}

export const useContextMenuContext = defineContext(KContextMenuContextKey)