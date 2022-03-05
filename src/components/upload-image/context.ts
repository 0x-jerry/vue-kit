import { Awaitable } from '@0x-jerry/utils'
import { HookManager } from '@/utils'
import type { InjectionKey } from 'vue'

export type AfterSelectImageHook = (files: File[]) => Awaitable<any>

export interface UploadImageHook {
  afterSelectImage: HookManager<AfterSelectImageHook>
}

export const createUploadImageContext = () => {
  const hooks: UploadImageHook = {
    afterSelectImage: new HookManager(),
  }

  return {
    hooks,
  }
}

export type UploadImageContext = ReturnType<typeof createUploadImageContext>

export const UploadImageContextKey = Symbol() as InjectionKey<UploadImageContext>
