<script lang="ts" setup>
import { watchImmediate } from '@vueuse/core'
import { useTemplateRef, watch } from 'vue'
import { useCmdInput } from './hooks/useCmdInput'
import { useCmdkContext } from './hooks/useCmdkContext'

export interface CombinationBoxProps {
  commandMode?: boolean
}

export interface CombinationBoxEvents {
  exit: []
}

const props = defineProps<CombinationBoxProps>()

const emit = defineEmits<CombinationBoxEvents>()

const ctx = useCmdkContext()!

const commandInputCtx = useCmdInput()!

const inputEl = useTemplateRef('inputEl')
const commandInputEl = useTemplateRef('commandInputEl')

watchImmediate(
  () => [props.commandMode, commandInputEl.value, inputEl.value],
  () => {
    focus()
  },
)

function focus() {
  inputEl.value?.focus()
  commandInputEl.value?.focus()
}

defineExpose({
  focus,
})
</script>

<template>
  <div class="combination-box flex gap-2" :class="{ 'is-loading': ctx.ui.state.isExecuting }">
    <template v-if="commandMode">
      <div class="icon" @click="emit('exit')">
        <i class="i-mdi:arrow-left-bold"></i>
      </div>

      <input
        v-if="commandInputCtx.state.enable"
        ref="commandInputEl"
        type="text"
        v-model="commandInputCtx.state.input"
        :placeholder="commandInputCtx.state.placeholder"
      />
    </template>
    <template v-else>
      <input
        ref="inputEl"
        v-model="ctx.ui.state.searchInput"
        type="text"
        placeholder="Input something"
      />
    </template>
  </div>
</template>

<style lang="less" scoped>
.combination-box {
  --uno: p-4;
  height: 50px;

  border-bottom: 1px solid #dcdcdc;

  input {
    appearance: none;
    width: 100%;
    outline: none;
  }

  &.is-loading {
    position: relative;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: 0px;

      height: 2px;
      width: 100%;

      --c: no-repeat linear-gradient(#6100ee 0 0);
      background: var(--c), var(--c), #d7b8fc;
      background-size: 60% 100%;
      animation: l16 3s infinite;
    }

    @keyframes l16 {
      0% {
        background-position: -150% 0, -150% 0;
      }
      66% {
        background-position: 250% 0, -150% 0;
      }
      100% {
        background-position: 250% 0, 250% 0;
      }
    }
    // todo
  }
}

.icon {
  --uno: bg-gray-3 inline-flex items-center justify-center size-21px rounded text-light-2 text-lg;
  cursor: pointer;

  i {
    display: inline-block;
  }
}
</style>
