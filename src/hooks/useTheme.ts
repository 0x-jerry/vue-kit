import { useConfig } from './useConfig'

export function useTheme() {
  const { theme } = useConfig()
  const { clsPrefix } = theme

  return {
    cls(block: string, status: Record<string, any> = {}, ...args: any[]) {
      return [
        //
        `${clsPrefix}${block}`,
        ...Object.entries(status).map(([k, v]) => !!v && `is-${k}`),
        ...args,
      ]
    },
  }
}
