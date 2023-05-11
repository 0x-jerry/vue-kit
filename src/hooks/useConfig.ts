import { type InjectionKey } from 'vue'

const configKey = Symbol() as InjectionKey<Config>

type Config = ReturnType<typeof createConfig>

function createConfig() {
  return {
    theme: {
      clsPrefix: 'k-',
    },
  }
}

export function useConfig() {
  const conf = inject(configKey, createConfig, true)

  return conf
}
