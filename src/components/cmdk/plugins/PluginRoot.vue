<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCmdInput } from '../hooks/useCmdInput'
import CommandList from '../components/CommandList.vue'
import { watchImmediate } from '@vueuse/core'
import type { CommandItemProps } from '../components/CommandItem.vue'
import { usePluginApi } from '../hooks/usePluginApi'

const inputCtx = useCmdInput()!
inputCtx.state.enable = true
inputCtx.state.placeholder = 'Search...'

const api = usePluginApi()!

api.abortSignal?.addEventListener('abort', (evt) => {
  console.log(evt.target)
})

const selected = ref(-1)

const list = [
  'Hello',
  'World',
  'Hello World',
  'Command',
  'Command Panel',
  'Deno',
  'Node',
  'Bun',
  'Rust',
  'C++',
  'C Plus',
  'Golang',
].map((n, i) => ({
  id: i,
  name: n,
}))

const filtered = computed(() => {
  return list.filter((n) => n.name.toLowerCase().includes(inputCtx.state.input.toLowerCase()))
})

const groups = computed(() => {
  return [
    {
      id: 1,
      items: filtered.value,
    },
  ]
})

watchImmediate(
  () => filtered.value,
  () => {
    selected.value = filtered.value.at(0)?.id ?? -1
  },
)

function handleClick(cmd: CommandItemProps) {
  console.log(cmd)

  api.exit()
}
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <CommandList v-model="selected" :groups="groups" @click-cmd="handleClick" />
  </div>
</template>

<style lang="less" scoped></style>
