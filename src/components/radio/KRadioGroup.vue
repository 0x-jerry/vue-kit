<script lang="ts" setup>
import { RadioGroupContextKey } from './hooks'

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: any) => true,
})

provide(RadioGroupContextKey, {
  get value() {
    return props.modelValue
  },
  get disabled() {
    return !!props.disabled
  },
  change(val) {
    if (props.disabled) return

    emit('update:modelValue', val)
  },
})
</script>

<template>
  <slot></slot>
</template>
