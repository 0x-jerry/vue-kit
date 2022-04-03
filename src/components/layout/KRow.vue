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
  <div class="k-row">
    <slot></slot>
  </div>
</template>

<style>
.k-row {
  @apply flex flex-wrap;

  column-gap: v-bind('gapSize');
}
</style>
