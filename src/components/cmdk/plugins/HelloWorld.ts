import { sleep } from '@0x-jerry/utils'
import PluginRoot from './PluginRoot.vue'
import { definePlugin, ExecuteMode } from './types'

export default definePlugin({
  name: 'Hello World',
  author: 'Jerry',
  identifier: 'hello-world',
  icon: 'i-mdi:windows',
  commands() {
    return [
      {
        name: 'One Shot Example',
        icon: 'i-mdi:star-shooting',
        execute(ctx) {
          ctx.toast('Hello from plugin')
        },
      },
      {
        name: 'Takeover Example',
        icon: 'i-mdi:chart-donut',
        mode: ExecuteMode.Takeover,
        run(ctx) {
          return PluginRoot
        },
      },
      {
        name: 'Full Example',
        icon: 'i-mdi:fullscreen',
        mode: ExecuteMode.Full,
        execute(ctx) {
          ctx.print('This is the result, line one\n')
          ctx.print('This is the result, line two')
        },
      },
      {
        name: 'Async Example',
        icon: 'i-mdi:fullscreen',
        mode: ExecuteMode.Full,
        async execute(ctx) {
          ctx.print('Starting...')
          await sleep(1000)

          if (ctx.abortSignal.aborted) {
            ctx.print('Aborted')
            return
          }

          ctx.clear()
          ctx.print('Done')
        },
      },
      {
        name: 'Async OneShot Example',
        icon: 'i-mdi:star-shooting',
        async execute(ctx) {
          ctx.print('Starting...')
          await sleep(1000)

          if (ctx.abortSignal.aborted) {
            ctx.print('Aborted')
            return
          }

          ctx.clear()
          ctx.print('Done')
        },
      },
      {
        name: 'Inline Example',
        icon: 'i-mdi:code-braces',
        mode: ExecuteMode.Inline,
        execute(ctx) {
          ctx.print('This is the inline result')
        },
      },
    ]
  },
})
