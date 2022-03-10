<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  loading?: boolean
  click?: (e: MouseEvent) => any
}>()

const emit = defineEmits<{
  (type: 'click', e: MouseEvent): void
}>()

const data = reactive({
  isExecuteFunction: false,
})

const _loading = computed(() => props.loading || data.isExecuteFunction)

const _disabled = computed(() => props.loading || props.disabled || data.isExecuteFunction)

async function handleClick(e: MouseEvent) {
  emit('click', e)

  if (props.click) {
    data.isExecuteFunction = true

    try {
      await props.click(e)
    } finally {
      data.isExecuteFunction = false
    }
  }
}
</script>

<template>
  <button
    class="k-button"
    :class="{
      'is-loading': _loading,
    }"
    :disabled="_disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style lang="less">
.k-button {
  @apply px-2 py-1;
  @apply text-gray-800;
  @apply border border-gray-200;
  @apply bg-gray-50;

  @apply transition transition-colors;

  &:hover {
    @apply text-blue-500 border-current;
  }

  &:active {
    @apply text-blue-700 border-current;
  }

  &:focus {
    @apply border-blue-500 outline-none;
  }

  &:disabled {
    @apply cursor-not-allowed;
    @apply text-gray-400;

    &:hover {
      @apply text-gray-400;
      @apply border-gray-200;
    }
  }

  &.is-loading {
    @apply cursor-wait;
  }
}
</style>
