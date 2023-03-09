<script lang="ts" setup>
import { useTheme } from '@/hooks'
import { useOnClick, useClickProps } from '@/hooks/useOnClick'
import { PropType } from 'vue'

const { cls } = useTheme()

const $click = useOnClick()

const props = defineProps({
  ...useClickProps,
  variety: {
    type: String as PropType<'primary' | 'blank'>,
    default: 'blank',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const _disabled = computed(() => props.disabled || $click.isProcessing)

const el = ref()
const mouse = useMouseInElement(el, {
  type: 'client',
  handleOutside: false,
})

const pos = computed(() => {
  const { isOutside, elementHeight, elementWidth, elementX, elementY } = mouse

  let xx = 0.5
  let yy = 0.5

  if (!isOutside.value && !_disabled.value) {
    xx = elementX.value / elementWidth.value
    yy = elementY.value / elementHeight.value
  }

  const y = yy - 0.5
  const x = xx - 0.5

  return {
    x,
    y,
  }
})

const overlayStyle = computed(() => {
  const range = 30

  const { x, y } = pos.value

  return {
    '--ry': `${-x * range}deg`,
    '--rx': `${y * range}deg`,
  }
})
</script>

<template>
  <button
    ref="el"
    :class="
      cls(
        'btn',
        {
          loading: $click.isProcessing,
        },
        `it-${variety}`,
      )
    "
    :style="overlayStyle"
    :disabled="_disabled"
    @click="$click.handler"
  >
    <div :class="cls('btn-bg')"></div>
    <slot></slot>
  </button>
</template>
