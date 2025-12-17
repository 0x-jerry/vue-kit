import { defineContext } from '@0x-jerry/vue-kit'
import type { ICmdkContext } from './useCmdkContext'

export interface CmdkPluginApiOption {
  cmdk: ICmdkContext
}

class CmdkPluginApi {
  constructor(private opt: CmdkPluginApiOption) {}

  get abortSignal() {
    return this.opt.cmdk.abortManager._controller?.signal
  }

  exit() {
    const { cmdk } = this.opt

    cmdk.exitTakeoverMode()
    cmdk.ui.hide(true)
  }
}

export const usePluginApi = defineContext(
  Symbol.for('cmdk-plugin-api'),
  (opt: CmdkPluginApiOption) => new CmdkPluginApi(opt),
)
