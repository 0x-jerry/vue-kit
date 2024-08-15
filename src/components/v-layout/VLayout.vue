<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'
import { normalizeCssValue } from './utils'

export type IGridLayoutType = 'grid' | 'flex' | 'flex-col'

export interface VLayoutProps {
  type?: IGridLayoutType
  /**
   * @example '20px' '20px 1rem' '40px' '20 16'
   */
  gap?: string | number
  col?: number | string
}

const props = withDefaults(
  defineProps<VLayoutProps>(),
  {
    type: 'grid',
    gap: 16,
    col: 4,
  },
)

const style = computed(() => {
  const { type, col } = props

  const style: CSSProperties = {
    display: type,
    gap: getGapValue(),
  }

  if (type === 'grid') {
    style.gridTemplateColumns = `repeat(${col}, minmax(0, 1fr))`
  } else if (type === 'flex-col') {
    style.display = 'flex'
    style.flexDirection = 'column'
  } else {
    style.flexWrap = 'wrap'
  }

  return style
})


function getGapValue() {
  const [x, y = x] = props.gap.toString().trim().split(/\s+/)

  return [normalizeCssValue(x), normalizeCssValue(y)].join(' ')
}

</script>

<template>
  <div class="v-layout" :style="style">
    <slot></slot>
  </div>
</template>
