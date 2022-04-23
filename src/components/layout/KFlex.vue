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
  <component :is="tag" class="k-flex">
    <slot></slot>
  </component>
</template>

<style>
.k-flex {
  @apply flex flex-wrap;

  gap: v-bind('gapSize');
}
</style>
