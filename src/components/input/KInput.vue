<script lang="ts" setup>
defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (type: 'update:modelValue', v: string): void
}>()

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement

  emit('update:modelValue', target.value || '')
}
</script>

<template>
  <span class="k-input--box">
    <input class="k-input" @input="handleInput" />
  </span>
</template>

<style lang="less">
.k-input--box {
  display: inline-block;
  width: 160px;
}

.k-input {
  @apply border border-gray-200;
  @apply transition transition-colors;
  @apply px-1;
  @apply w-full;

  &:focus {
    @apply outline-none;
  }

  &:focus,
  &:active,
  &:hover {
    @apply border-blue-500;
  }
}
</style>
