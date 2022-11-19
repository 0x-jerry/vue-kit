import { Promisable } from '@0x-jerry/utils'
import { HookManager } from '@/utils'
import type { InjectionKey } from 'vue'

export type AfterSelectImageHook = (files: File[]) => Promisable<any>

export interface KImageUploaderHook {
  afterSelectImage: HookManager<AfterSelectImageHook>
}

export const createUploadImageContext = () => {
  const hooks: KImageUploaderHook = {
    afterSelectImage: new HookManager(),
  }

  return {
    hooks,
  }
}

export type KImageUploaderContext = ReturnType<typeof createUploadImageContext>

export const KImageUploaderContextKey = Symbol() as InjectionKey<KImageUploaderContext>
