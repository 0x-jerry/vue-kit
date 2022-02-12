import { Resolver } from 'unplugin-auto-import/dist/types'

/**
 * 自动引入的变量
 */
const globalPropNames = ['logger', 'loggerProd']

export const globalResolver: Resolver = (name) => {
  if (!globalPropNames.includes(name)) return

  return {
    module: '@/global',
    from: name,
    name,
  }
}
