<script lang="ts" setup>
import type { Component } from 'vue'
import { useContextMenuContext } from './context'

const props = defineProps<{
  icon?: Component
  disabled?: boolean
  content?: string
  suffix?: string
}>()

const emit = defineEmits({
  click: (e: MouseEvent) => true,
})

const ctx = useContextMenuContext()

function handleClick(e: MouseEvent) {
  if (props.disabled) return

  ctx?.close()
  emit('click', e)
}
</script>

<template>
  <div class="k-context-menu--item" :disabled="!!disabled" @click="handleClick">
    <i class="k-context-menu--icon">
      <slot name="icon">
        <component :is="icon"></component>
      </slot>
    </i>
    <div class="k-context-menu--label">
      <slot>
        {{ content }}
      </slot>
    </div>
    <div class="k-context-menu--suffix">
      <slot name="suffix">{{ suffix }}</slot>
    </div>
  </div>
</template>

<style lang="less">
.k-context-menu {
  &--item {
    @apply bg-transparent;
    @apply transition transition-colors;
    @apply px-2 py-1 mx-2 my-1 rounded;
    @apply text-gray-400;
    @apply text-base;
    @apply flex items-center gap-2;
    @apply cursor-pointer;

    &:hover {
      @apply bg-gray-100;
      @apply text-gray-700;
    }

    &[disabled='true'] {
      cursor: not-allowed;
      // @apply bg-;
      @apply text-gray-300;

      &:hover {
        @apply text-gray-300;
      }
    }
  }

  &--icon {
    display: contents;
    @apply text-lg;
  }

  &--label {
    @apply flex-1;
  }

  &--suffix {
    @apply text-sm;
    @apply text-gray-300;
  }
}
</style>
