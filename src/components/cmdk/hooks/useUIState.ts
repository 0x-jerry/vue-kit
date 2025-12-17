import { defineContext } from '@0x-jerry/vue-kit'
import { computed, reactive, shallowRef, type Component } from 'vue'
import { nextId } from './utils'
import type { ICmdkConfigurationManager } from './useConfigurationManager'
import { CoreConfigurationKey } from '../plugins/CorePlugin'
import { watchImmediate } from '@vueuse/core'
import { useCmdInput, type ICommandInputContext } from './useCmdInput'
import type { CommandGroupProps } from '../components/CommandGroup.vue'

export enum CmdkUIStatus {
  None,
  Takeover,
}

export enum OutputMode {
  None,
  Inline,
  Full,
}

export interface CmdkUIStateOption {
  cfm: ICmdkConfigurationManager
}

class CmdkUIState {
  /**
   * Reactive state
   */
  state = reactive({
    visible: false,
    searchInput: '',
    activePanelItemId: -1,
    status: CmdkUIStatus.None,
    isExecuting: false,
    groups: [] as CommandGroupProps[],
    output: {
      mode: OutputMode.None,
      lines: [] as string[],
    },
  })

  _clearStateHandler: NodeJS.Timeout | number = 0

  _cmdInputCtx: ICommandInputContext

  constructor(readonly opt: CmdkUIStateOption) {
    this._cmdInputCtx = useCmdInput.provide()

    watchImmediate(
      () => this.state.searchInput,
      () => {
        const id = this.filteredGroup.value.at(0)?.items.at(0)?.id

        this.state.activePanelItemId = id ?? -1
      },
    )
  }

  get isTakeoverMode() {
    return this.state.status === CmdkUIStatus.Takeover
  }

  filteredGroup = computed(() => {
    return this.state.groups
      .map((n) => {
        const items = n.items.filter((k) => {
          return k.name.toLowerCase().includes(this.state.searchInput.toLowerCase())
        })

        return {
          ...n,
          items,
        }
      })
      .filter((n) => n.items.length > 0)
  })

  takeoverRoot = shallowRef<Component>()

  getOrCreateGroup(name: string): CommandGroupProps {
    let group = this.state.groups.find((n) => n.name === name)

    if (!group) {
      group = {
        name: name,
        items: [],
        id: nextId(),
      }

      this.state.groups.push(group)
    }

    return group
  }

  updateActivePanelItem() {
    const allItems = this.filteredGroup.value.map((n) => n.items).flat()

    let idx = allItems.findIndex((n) => n.id === this.state.activePanelItemId)

    if (idx === -1) {
      this.state.activePanelItemId = allItems.at(0)?.id ?? -1
    }
  }

  enterTakeoverMode(root: Component) {
    this.takeoverRoot.value = root
    this.state.status = CmdkUIStatus.Takeover
  }

  exitTakeoverMode() {
    if (this.state.status === CmdkUIStatus.Takeover) {
      this.state.status = CmdkUIStatus.None
      this.takeoverRoot.value = undefined
      return true
    }
  }

  show() {
    clearTimeout(this._clearStateHandler)
    this.updateActivePanelItem()

    this.state.visible = true
  }

  hide(clearStateImmediate = false) {
    if (!this.state.visible) {
      return
    }

    this.state.visible = false

    if (clearStateImmediate) {
      this._clearState()
    } else {
      this._createClearStateTimer()
    }

    return true
  }

  _createClearStateTimer() {
    const ts = this.opt.cfm.get<number>(CoreConfigurationKey.clearStateTimeout)

    if (ts == null) {
      return
    }

    clearTimeout(this._clearStateHandler)

    this._clearStateHandler = setTimeout(() => {
      this._clearState()
    }, ts)
  }

  _clearState() {
    this.state.searchInput = ''
    this.state.activePanelItemId = -1

    this.resetOutput()

    this._cmdInputCtx.reset()
  }

  clearCmdInput() {
    return this._cmdInputCtx.clear()
  }

  resetCmdInput() {
    this._cmdInputCtx.reset()
  }

  toggleVisible() {
    if (this.state.visible) {
      this.hide()
    } else {
      this.show()
    }
  }

  writeOutput(line: string) {
    this.state.output.lines.push(line)
  }

  clearOutput() {
    this.state.output.lines.splice(0)
  }

  resetOutput() {
    this.state.output.mode = OutputMode.None

    this.state.output.lines.splice(0)
  }

  clearSearchInput() {
    if (this.state.searchInput.length) {
      this.state.searchInput = ''

      return true
    }
  }
}

export type ICmdkUIState = InstanceType<typeof CmdkUIState>

export const useUIState = defineContext(
  Symbol.for('cmdk-ui'),
  (opt: CmdkUIStateOption) => new CmdkUIState(opt),
)
