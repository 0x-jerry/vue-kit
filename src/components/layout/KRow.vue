<script lang="ts" setup>
import { parseStyleProperty } from '@/utils'

const props = withDefaults(
  defineProps<{
    gap?: number | string
    tag?: string
  }>(),
  {
    gap: '0.25rem',
    tag: 'div',
  },
)

const gapSize = computed(() => parseStyleProperty(props.gap))
</script>

<template>
  <component :is="tag" class="k-row">
    <slot></slot>
  </component>
</template>

<style>
.k-row {
  @apply flex flex-wrap;

  column-gap: v-bind('gapSize');
}
</style>
