<script lang="ts" setup>
import { OutputMode, useUIState } from './hooks/useUIState'

const ui = useUIState()!
</script>

<template>
  <div class="panel-footer">
    <!-- Extra information -->
    <i class="icon i-mdi:wifi text-base"></i>
    <span class="flex-1 w-0">
      <div class="inline-output" v-if="ui.state.output.mode === OutputMode.Inline">
        {{ ui.state.output.lines.join(' ') }}
      </div>
    </span>
    <div class="shortcut">
      <span class="name"> Open Command </span>
      <code class="code">C + K</code>
    </div>
    <div class="shortcut">
      <span class="name"> Actions </span>
      <code class="code">C + K</code>
    </div>
  </div>
</template>

<style lang="less" scoped>
.panel-footer {
  --uno: px-4 gap-2 size-full;

  background: #eee;
  border-top: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
}

.shortcut {
  display: flex;
  align-items: center;
  position: relative;
  gap: 4px;

  .name {
    --uno: text-gray-5;
  }

  .code {
    --uno: bg-gray-3 rounded text-xs;
    padding: 2px 4px;
  }

  & + & {
    &::before {
      position: absolute;
      top: 50%;
      left: 1px;
      content: '';
      width: 1px;
      height: 50%;
      transform: translate(0, -50%);
      background: #ccc;
    }

    padding-left: 10px;
  }
}
</style>
