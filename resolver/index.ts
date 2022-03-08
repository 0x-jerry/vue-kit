import type { Awaitable } from '@0x-jerry/utils'
import type { ComponentResolver } from 'unplugin-vue-components/types'

export interface VueKitResolverOption {
  exclude?: (name: string) => Awaitable<boolean>
}

export function VueKitResolver(opt: VueKitResolverOption = {}): ComponentResolver {
  //
  return async (name) => {
    if (await opt.exclude?.(name)) return

    // ex. KButton
    if (!name.match(/^K[A-Z]/)) return

    const componentName = name.slice(1)

    return {
      importName: componentName,
      path: '@0x-jerry/vue-kit',
    }
  }
}
