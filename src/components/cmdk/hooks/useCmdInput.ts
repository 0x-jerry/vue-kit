import { defineContext } from '@0x-jerry/vue-kit'
import { reactive } from 'vue'

class CommandInputContext {
  /**
   * Reactive state
   */
  state = reactive({
    enable: false,
    input: '',
    placeholder: '',
  })

  clear() {
    if (this.state.input.length) {
      this.state.input = ''
      return true
    }
  }

  reset() {
    this.state.enable = false
    this.state.placeholder = ''
    this.state.input = ''
  }
}

export type ICommandInputContext = InstanceType<typeof CommandInputContext>

export const useCmdInput = defineContext(
  Symbol.for('cdmk-cmd-input'),
  () => new CommandInputContext(),
)
