<script lang="ts" setup>
import { parseStyleProperty } from '../../utils'

const props = withDefaults(
  defineProps<{
    offset?: number | string
  }>(),
  {
    offset: 10,
  },
)

const styleVar = computed(() => {
  return {
    offset: parseStyleProperty(props.offset),
  }
})
</script>

<template>
  <transition name="k-fade">
    <slot> </slot>
  </transition>
</template>

<style lang="less">
.k-fade {
  &-enter-active,
  &-leave-active {
    @apply transition ease-in-out;
    transition-property: transform opacity;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(v-bind('styleVar.offset'));
  }
}
</style>
