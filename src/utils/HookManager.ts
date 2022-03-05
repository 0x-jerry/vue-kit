import { Fn } from '@0x-jerry/utils'

export class HookManager<Hook extends Fn> extends Set<Hook> {
  async applyHooks(...parameters: Parameters<Hook>) {
    for (const item of this) {
      await item(...parameters)
    }
  }
}
