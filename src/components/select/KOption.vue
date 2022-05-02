<script lang="ts" setup>
import { SelectContextKey } from './context'

const props = defineProps<{
  value: unknown
  label?: string
  disabled?: boolean
}>()

const ctx = inject(SelectContextKey, null)

const isSelected = computed(() => ctx?.selected.value === props.value)

onMounted(() => {
  ctx?.addOption(props.value, props.label ?? String(props.value))

  return () => ctx?.removeOption(props.value)
})

function handleChange() {
  if (props.disabled) return

  ctx?.change(props.value)
}
</script>

<template>
  <div
    class="k-option"
    :class="{ 'is-disabled': disabled, 'is-selected': isSelected }"
    @click="handleChange"
  >
    <slot>
      {{ label ?? String(value) }}
    </slot>
  </div>
</template>

<style lang="less">
.k-option {
  cursor: pointer;
  @apply px-2;
  @apply rounded-sm;

  &:hover {
    @apply bg-light-400;
  }

  &.is-selected {
    @apply bg-light-600;
  }

  &.is-disabled {
    @apply bg-light-300 text-gray-400;

    cursor: not-allowed;
  }
}
</style>
