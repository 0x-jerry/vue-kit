<script lang="ts" setup>
import { SelectContext, SelectContextKey } from './context'

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

const ctx: SelectContext = {
  get disabled() {
    return !!props.disabled
  },
  get value() {
    return props.modelValue
  },
  change(val: unknown) {
    if (props.disabled) return

    emit('update:modelValue', val)
  },
}

provide(SelectContextKey, ctx)
</script>

<template>
  <select :value="props.modelValue">
    <slot></slot>
  </select>
</template>

<style></style>
