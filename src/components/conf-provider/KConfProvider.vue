<script lang="ts" setup>
import { ConfProviderContextKey } from './context'
import { confProviderProps } from './props'

const props = defineProps({
  ...confProviderProps,
})

provide(ConfProviderContextKey, props)
</script>

<template>
  <slot></slot>
</template>

<style></style>
