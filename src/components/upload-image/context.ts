import { Awaitable } from '@0x-jerry/utils'
import { HookManager } from '@/utils'
import type { InjectionKey } from 'vue'

export type AfterSelectImageHook = (files: File[]) => Awaitable<any>

export interface KUploadImageHook {
  afterSelectImage: HookManager<AfterSelectImageHook>
}

export const createUploadImageContext = () => {
  const hooks: KUploadImageHook = {
    afterSelectImage: new HookManager(),
  }

  return {
    hooks,
  }
}

export type KUploadImageContext = ReturnType<typeof createUploadImageContext>

export const KUploadImageContextKey = Symbol() as InjectionKey<KUploadImageContext>
