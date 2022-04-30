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
  <component :is="props.tag" class="k-col">
    <slot></slot>
  </component>
</template>

<style>
.k-col {
  @apply flex flex-col;

  row-gap: v-bind('gapSize');
}
</style>
