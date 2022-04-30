<script lang="ts" setup>
import { CheckboxGroupContextKey } from './hooks'

const props = defineProps<{
  modelValue: unknown[]
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown[]) => true,
})

provide(CheckboxGroupContextKey, {
  get value() {
    return props.modelValue
  },
  get disabled() {
    return !!props.disabled
  },
  change(val, selected) {
    if (props.disabled) return

    const v = [...props.modelValue]

    if (selected) {
      v.push(val)
    } else {
      const idx = v.indexOf(val)
      v.splice(idx, 1)
    }

    emit('update:modelValue', [...new Set(v)])
  },
})
</script>

<template>
  <slot></slot>
</template>
