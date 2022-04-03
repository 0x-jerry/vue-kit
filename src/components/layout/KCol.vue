<script lang="ts" setup>
import { parseStyleProperty } from '@/utils'

const props = withDefaults(
  defineProps<{
    gap: number | string
  }>(),
  {
    gap: '0.25rem',
  },
)

const gapSize = computed(() => parseStyleProperty(props.gap))
</script>

<template>
  <div class="k-col">
    <slot></slot>
  </div>
</template>

<style>
.k-col {
  @apply flex flex-col;

  row-gap: v-bind('gapSize');
}
</style>
