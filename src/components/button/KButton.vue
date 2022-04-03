<script lang="ts" setup>
import { useOnClick, useClickProps } from '@/hooks/useOnClick'

const $click = useOnClick()

const props = defineProps({
  ...useClickProps,
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
    :class="{
      'is-loading': $click.isProcessing,
    }"
    :disabled="_disabled"
    @click="$click.handler"
  >
    <slot></slot>
  </button>
</template>

<style lang="less">
.k-button {
  @apply px-2 py-1;
  @apply text-gray-800;
  @apply border border-gray-200;
  @apply bg-gray-50;

  @apply transition transition-colors;

  &:hover {
    @apply text-blue-500 border-current;
  }

  &:active {
    @apply text-blue-700 border-current;
  }

  &:focus {
    @apply border-blue-500 outline-none;
  }

  &:disabled {
    @apply cursor-not-allowed;
    @apply text-gray-400;

    &:hover {
      @apply text-gray-400;
      @apply border-gray-200;
    }
  }

  &.is-loading {
    @apply cursor-wait;
  }
}
</style>
