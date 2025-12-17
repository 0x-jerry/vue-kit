<script lang="ts" setup>
import { useEventListener, watchImmediate } from '@vueuse/core'
import type { CommandItemProps } from './CommandItem.vue'
import type { CommandGroupProps } from './CommandGroup.vue'
import CommandGroup from './CommandGroup.vue'
import { useTemplateRef } from 'vue'

export interface CommandListProps {
  groups: CommandGroupProps[]
}

export interface CommandListEvents {
  clickCmd: [cmd: CommandItemProps]
}

const props = defineProps<CommandListProps>()

const emit = defineEmits<CommandListEvents>()

const rootEl = useTemplateRef('rootEl')
const vModel = defineModel<number>()

watchImmediate(
  () => [vModel.value, rootEl.value],
  () => {
    rootEl.value?.querySelector(`[data-command-id="${vModel.value}"]`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  },
)

function setActive(id: number) {
  vModel.value = id
}

useEventListener('keydown', (evt) => {
  if (evt.code === 'ArrowUp') {
    evt.preventDefault()
    navigate(-1)
  } else if (evt.code === 'ArrowDown') {
    evt.preventDefault()
    navigate(1)
  } else if (evt.code === 'Enter') {
    evt.preventDefault()
    emitClickCmd()
  }
})

function navigate(offset: number) {
  const items = props.groups.map((n) => n.items).flat()

  let idx = items.findIndex((i) => i.id === vModel.value)

  if (idx === -1) {
    idx = 0
  } else {
    idx = (idx + offset) % items.length
  }

  const id = items.at(idx)?.id

  if (id != null) {
    vModel.value = id
  }
}

function emitClickCmd() {
  const items = props.groups.map((n) => n.items).flat()

  const cmd = items.find((i) => i.id === vModel.value)

  if (cmd) {
    emit('clickCmd', cmd)
  }
}
</script>

<template>
  <div class="command-list" ref="rootEl">
    <CommandGroup
      v-for="item in props.groups"
      v-bind="item"
      :key="item.id"
      :active-id="vModel"
      @selected="setActive($event.id)"
      @click-cmd="emit('clickCmd', $event)"
    />
  </div>
</template>

<style lang="less" scoped>
.command-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    --uno: text-gray-4 text-sm mb-0;
  }
}
</style>
