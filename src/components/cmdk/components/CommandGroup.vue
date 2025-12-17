<script lang="ts" setup>
import type { CommandItemProps } from './CommandItem.vue'
import CommandItem from './CommandItem.vue'

export interface CommandGroupProps {
  id: number
  name?: string
  activeId?: number
  items: CommandItemProps[]
}

export interface CommandGroupEvents {
  clickCmd: [cmd: CommandItemProps]
  selected: [cmd: CommandItemProps]
}

const props = defineProps<CommandGroupProps>()

const emit = defineEmits<CommandGroupEvents>()
</script>

<template>
  <div class="command-list">
    <div class="title" v-if="props.name">{{ props.name }}</div>
    <CommandItem
      v-for="item in props.items"
      v-bind="item"
      :key="item.id"
      :data-command-id="item.id"
      :is-active="item.id === activeId"
      @mouseover="emit('selected', item)"
      @click="emit('clickCmd', item)"
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
