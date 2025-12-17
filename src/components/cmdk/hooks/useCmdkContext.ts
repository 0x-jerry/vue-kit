import { defineContext } from '@0x-jerry/vue-kit'
import { useEventListener } from '@vueuse/core'
import {
  ExecuteMode,
  type CmdkPluginFactory,
  type ExecuteContext,
  type PluginApi,
  type RuntimeContext,
} from '../plugins/types'
import { OutputMode, useUIState, type ICmdkUIState } from './useUIState'
import { usePluginManager, type ICmdkPluginManager } from './usePluginManager'
import { useConfigurationManager, type ICmdkConfigurationManager } from './useConfigurationManager'
import { usePluginApi } from './usePluginApi'

export enum CmdkStatus {
  Initialized,
  Takeover,
}

interface ExtraContextInfo {
  abortController: AbortController
}

class AbortManager {
  _controller?: AbortController | null

  set(newController?: AbortController | null, reason?: string) {
    if (!newController) {
      this.abort(reason ?? 'Abort by system')
    } else {
      this.abort(reason ?? 'Replaced by new controller')
    }

    this._controller = newController
  }

  abort(reason: string) {
    if (this._controller?.signal.aborted) {
      this._controller = null
      return false
    }

    if (!this._controller) {
      return false
    }

    this._controller.abort(reason)

    this._controller = null

    return true
  }
}

export interface ICmdkContextOption {
  cfm: ICmdkConfigurationManager
  pm: ICmdkPluginManager
  ui: ICmdkUIState
}

class CmdkContext {
  abortManager = new AbortManager()

  constructor(private opt: ICmdkContextOption) {
    //
  }

  get ui() {
    return this.opt.ui
  }

  get pm() {
    return this.opt.pm
  }

  get cfm() {
    return this.opt.cfm
  }

  async initialize() {
    useEventListener('keydown', _createKeydownHandler(this))

    await this.cfm.load()
  }

  async executeCommand(id: number) {
    const { ui, pm, abortManager } = this
    const command = pm.commandsMap.get(id)
    if (!command) {
      return
    }

    //#region reset state
    ui.resetOutput()
    ui.resetCmdInput()
    //#endregion

    if (command.mode === ExecuteMode.Takeover) {
      const [ctx, extra] = _createRuntimeContext(this)

      abortManager.set(extra.abortController)

      try {
        const root = command.run?.(ctx)

        if (root) {
          ui.enterTakeoverMode(root)
        }
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      const [ctx, extra] = _createExecuteContext(this)
      ui.state.isExecuting = true

      extra.abortController.signal.addEventListener('abort', () => {
        ui.state.isExecuting = false
      })

      abortManager.set(extra.abortController)

      if (command.mode === ExecuteMode.Inline) {
        ui.state.output.mode = OutputMode.Inline
      } else if (command.mode === ExecuteMode.Full) {
        ui.state.output.mode = OutputMode.Full
      }

      if (command.mode === ExecuteMode.OneShot) {
        try {
          command.execute?.(ctx)
        } catch (error) {
          console.error('Executing error:', error)
        }

        ui.hide()
      } else {
        try {
          await command.execute?.(ctx)
        } catch (error) {
          console.error('Executing error:', error)
        }
      }

      abortManager.abort('Execute finished')
    }

    return
  }

  async addPlugin(plugin: CmdkPluginFactory) {
    const { pm, cfm, ui } = this
    const normalizedPlugin = await pm.add(plugin)

    cfm.init(normalizedPlugin.configuration ?? [])

    const groupName = 'Command'

    const group = ui.getOrCreateGroup(groupName)

    for (const item of normalizedPlugin.panelItems) {
      group.items.push({
        id: item.id,
        name: item.name,
        icon: item.icon || 'i-mdi:apple',
        category: groupName,
      })
    }

    ui.updateActivePanelItem()
  }

  exitTakeoverMode() {
    const { ui, abortManager } = this
    if (ui.exitTakeoverMode()) {
      abortManager.abort('Exit takeover mode')
      return true
    }
  }

  exitFullOutputMode() {
    const { ui, abortManager } = this

    if (ui.state.output.mode === OutputMode.Full) {
      ui.resetOutput()
      abortManager.abort('Exit full output mode')
      return true
    }
  }
}

function _createRuntimeContext(cmdk: CmdkContext): [RuntimeContext, ExtraContextInfo] {
  const abortController = new AbortController()

  const ctx: RuntimeContext = {
    api: _createPluginApi(cmdk),
    abortSignal: abortController.signal,
  }

  const extra: ExtraContextInfo = {
    abortController,
  }

  return [ctx, extra]
}

function _createExecuteContext(cmdk: CmdkContext): [ExecuteContext, ExtraContextInfo] {
  const { ui } = cmdk

  const abortController = new AbortController()

  const ctx: ExecuteContext = {
    abortSignal: abortController.signal,
    api: _createPluginApi(cmdk),
    toast(message) {
      // todo
      console.log('Toast:', message)
    },
    clear() {
      ui.clearOutput()
    },
    print(...args: any[]) {
      ui.writeOutput(String.raw({ raw: args }))
      console.log('Print:', ...args)
    },
  }

  const extra: ExtraContextInfo = {
    abortController,
  }

  return [ctx, extra]
}

function _createPluginApi(cmdk: CmdkContext) {
  const { cfm } = cmdk

  const api: PluginApi = {
    logger: console,
    getConfig<T>(key: string): T | undefined {
      const value = cfm.get<T>(key)

      return value
    },
    setConfig(key, value) {
      cfm.set(key, value)
    },
  }

  return api
}

function _createKeydownHandler(cmdk: CmdkContext) {
  const { ui } = cmdk

  const actionMap: Record<string, (evt: KeyboardEvent) => any> = {
    Escape(e) {
      if (_handleEscapeEvent(cmdk)) {
        e.preventDefault()
      }
    },
    KeyP(e) {
      if (ui.isTakeoverMode) {
        return
      }

      if (!(e.metaKey || e.ctrlKey)) {
        return
      }

      e.preventDefault()

      ui.toggleVisible()
    },
  }

  return (evt: KeyboardEvent) => {
    actionMap[evt.code]?.(evt)
  }
}

function _handleEscapeEvent(cmdk: CmdkContext) {
  const { abortManager, ui } = cmdk

  const escapeStack: (() => boolean | void)[] = [
    //
    () => ui.clearCmdInput(),
    () => cmdk.exitTakeoverMode() || cmdk.exitFullOutputMode(),
    () => abortManager.abort('User action'),
    () => ui.clearSearchInput(),
    () => ui.hide(),
  ]

  let idx = 0
  while (idx < escapeStack.length) {
    if (escapeStack[idx]()) {
      return true
    }

    idx++
  }

  return false
}

export type ICmdkContext = InstanceType<typeof CmdkContext>

export const useCmdkContext = defineContext(Symbol.for('cmdk-context'), () => {
  const pm = usePluginManager.provide()
  const cfm = useConfigurationManager.provide()

  const ui = useUIState.provide({
    cfm,
  })

  const cmdk = new CmdkContext({
    ui,
    pm,
    cfm,
  })

  usePluginApi.provide({
    cmdk,
  })

  return cmdk
})
