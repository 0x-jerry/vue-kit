<script lang="ts" setup>
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import CombinationBox from './CombinationBox.vue'
import CommandList from './components/CommandList.vue'
import { useCmdkContext } from './hooks/useCmdkContext'
import { OutputMode } from './hooks/useUIState'
import PanelFooter from './PanelFooter.vue'
import CorePlugin from './plugins/CorePlugin'
import HelloWorldPlugin from './plugins/HelloWorld'

const ctx = useCmdkContext.provide()

const inputBox = useTemplateRef('combinationBox')

watchImmediate(
  () => [ctx.ui.state.visible, inputBox.value],
  () => {
    if (ctx.ui.state.visible) {
      inputBox.value?.focus()
    }
  },
)

initialize()

async function initialize() {
  await ctx.initialize()

  const plugins = [CorePlugin, HelloWorldPlugin]

  for (const plugin of plugins) {
    ctx.addPlugin(plugin)
  }

  ctx.ui.show()
}

function handleBackEvent() {
  ctx.exitTakeoverMode()
  ctx.exitFullOutputMode()
}
</script>

<template>
  <div class="root" v-if="ctx.ui.state.visible">
    <div class="header">
      <CombinationBox
        ref="combinationBox"
        :command-mode="ctx.ui.isTakeoverMode || ctx.ui.state.output.mode === OutputMode.Full"
        @exit="handleBackEvent"
      />
    </div>
    <div class="content">
      <template v-if="ctx.ui.isTakeoverMode">
        <component :is="ctx.ui.takeoverRoot.value" />
      </template>
      <template v-else-if="ctx.ui.state.output.mode === OutputMode.Full">
        <div class="p-4">
          <pre><code v-for="line in ctx.ui.state.output.lines">{{ line }}</code></pre>
        </div>
      </template>
      <template v-else>
        <CommandList
          class="px-4 py-2"
          v-model="ctx.ui.state.activePanelItemId"
          :groups="ctx.ui.filteredGroup.value"
          @click-cmd="ctx.executeCommand($event.id)"
        />
      </template>
    </div>
    <div class="footer">
      <PanelFooter />
    </div>
  </div>
</template>

<style lang="less" scoped>
.root {
  --bg: #f1f1ee;

  --uno: shadow-xl rounded-xl text-gray-7;
  border: 1px solid #eee;

  background: var(--bg);
  width: 600px;
  height: 400px;

  display: flex;
  flex-direction: column;
}

.header {
}

.content {
  height: 0;
  flex: 1;
  overflow: auto;
}

.footer {
  height: 28px;
}
</style>
