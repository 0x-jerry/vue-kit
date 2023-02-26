<script lang="ts" setup>
import { useTheme } from '@/hooks'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  (type: 'update:modelValue', v: string): void
}>()

const { cls } = useTheme()

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement

  emit('update:modelValue', target.value || '')
}
</script>

<template>
  <input
    :class="cls('input', { disabled })"
    :disabled="props.disabled"
    :value="modelValue"
    @input="handleInput"
    :placeholder="placeholder"
  />
</template>
