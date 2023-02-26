<script lang="ts" setup>
import { useTheme } from '@/hooks'
import { useOnClick, useClickProps } from '@/hooks/useOnClick'
import { PropType } from 'vue'

const { cls } = useTheme()

const $click = useOnClick()

const props = defineProps({
  ...useClickProps,
  variety: {
    type: String as PropType<'text' | 'primary' | 'blank'>,
    default: 'blank',
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
    :class="
      cls(
        'btn',
        {
          loading: $click.isProcessing,
        },
        `it-${variety}`,
      )
    "
    :disabled="_disabled"
    @click="$click.handler"
  >
    <slot></slot>
  </button>
</template>
