import { definePlugin } from './types'

export enum CoreConfigurationKey {
  clearStateTimeout = 'core.clearStateTimeout',
}

export default definePlugin({
  name: 'Core Plugin',
  author: 'Jerry',
  identifier: 'jerry.core',
  configuration: [
    {
      key: CoreConfigurationKey.clearStateTimeout,
      defaultValue: 1000,
      schema: {
        type: 'number',
      },
    },
  ],
})
