import { defineContext } from '@0x-jerry/vue-kit'
import {
  type CmdkPlugin,
  type CmdkPluginFactory,
  type CommandItem,
  ExecuteMode,
} from '../plugins/types'
import { nextId } from './utils'

export interface NormalizedPlugin extends CmdkPlugin {
  id: number

  panelItems: (CommandItem & { id: number })[]
}

class CmdkPluginManager {
  plugins: NormalizedPlugin[] = []

  commandsMap = new Map<number, CommandItem>()

  async add(plugin: CmdkPluginFactory): Promise<NormalizedPlugin> {
    const p = await this._build(plugin)

    this.plugins.push(p)

    return p
  }

  async _build(pluginFactory: CmdkPluginFactory): Promise<NormalizedPlugin> {
    const plugin = typeof pluginFactory === 'function' ? await pluginFactory() : pluginFactory

    const items = plugin.commands?.() || []

    const normalized: NormalizedPlugin = {
      ...plugin,
      id: nextId(),
      panelItems: [],
    }

    for (const item of items) {
      const id = nextId()

      item.mode ??= ExecuteMode.OneShot
      item.icon ??= plugin.icon

      this.commandsMap.set(id, item)

      normalized.panelItems.push({
        ...item,
        id,
      })
    }

    return normalized
  }
}

export type ICmdkPluginManager = InstanceType<typeof CmdkPluginManager>

export const usePluginManager = defineContext(
  Symbol.for('cmdk-plugin-manager'),
  () => new CmdkPluginManager(),
)
