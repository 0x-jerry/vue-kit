<script lang="ts" setup>
import { RadioGroupContext, RadioGroupContextKey } from './context'

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: any) => true,
})

const ctx: RadioGroupContext = {
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
}

provide(RadioGroupContextKey, ctx)
</script>

<template>
  <slot></slot>
</template>
