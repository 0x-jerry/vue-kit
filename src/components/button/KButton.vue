<script lang="ts" setup>
import { useOnClick, useClickProps } from '@/hooks/useOnClick'
import { PropType } from 'vue'

const $click = useOnClick()

const props = defineProps({
  ...useClickProps,
  variety: {
    type: String as PropType<'text' | 'button'>,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const _disabled = computed(() => props.disabled || $click.isProcessing)
</script>

<template>
  <button
    class="k-button"
    :class="[
      {
        'is-loading': $click.isProcessing,
      },
      `is-${variety}`,
    ]"
    :disabled="_disabled"
    @click="$click.handler"
  >
    <slot></slot>
  </button>
</template>

<style lang="less">
.k-button {
  @apply text-gray-800;

  @apply transition transition-colors;
  @apply focus:outline-none;

  &.is-text {
    &:hover,
    &:active {
      @apply text-blue-500;
    }

    &:active {
      @apply text-blue-700 border-current;
    }
  }

  &.is-button {
    @apply px-2 py-1;
    @apply border border-gray-200;
    @apply bg-gray-50;

    &:hover,
    &:active {
      @apply text-blue-500 border-current;
    }

    &:active {
      @apply text-blue-700 border-current;
    }

    &:disabled {
      &:hover {
        @apply border-gray-200;
      }
    }
  }

  &:disabled {
    cursor: not-allowed;
    @apply text-gray-400;

    &:hover {
      @apply text-gray-400;
    }
  }

  &.is-loading {
    @apply cursor-wait;
  }
}
</style>
