<script lang="ts" setup>
const props = defineProps<{
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
  <span class="k-input--box" :class="{ 'is-disabled': props.disabled }">
    <input class="k-input" :disabled="props.disabled" :value="modelValue" @input="handleInput" />
  </span>
</template>

<style lang="less">
.k-input--box {
  display: inline-flex;
  width: 160px;

  &.is-disabled {
    .k-input {
      @apply border-gray-200 text-gray-400;
      cursor: not-allowed;
    }
  }
}

.k-input {
  @apply border border-gray-300;
  @apply transition transition-colors;
  @apply px-2 py-1;
  @apply w-full;
  font-size: inherit;

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
