import { defineContext } from '@0x-jerry/vue-kit'

export type JsonSchema = any

export interface ConfigurationItem {
  key: string
  defaultValue?: any
  schema: JsonSchema
}

class CmdkConfigurationManager {
  _configs: Record<string, any> = []

  async load() {
    const conf = localStorage.getItem('config')

    if (conf) {
      this._configs = JSON.parse(conf)
    }
  }

  async save() {
    localStorage.setItem('config', JSON.stringify(this._configs))
  }

  init(configurations: ConfigurationItem[]) {
    for (const configuration of configurations) {
      if (configuration.defaultValue != null) {
        if (this.get(configuration.key) == null) {
          this.set(configuration.key, configuration.defaultValue)
        }
      }
    }
  }

  set<T>(key: string, value: T) {
    this._configs[key] = value
  }

  get<T>(key: string): T | undefined {
    return this._configs[key]
  }
}

export type ICmdkConfigurationManager = InstanceType<typeof CmdkConfigurationManager>

export const useConfigurationManager = defineContext(
  Symbol.for('cmdk-configuration-manager'),
  () => new CmdkConfigurationManager(),
)
