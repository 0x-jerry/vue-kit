<script lang="ts" setup>
import { SelectContextKey } from './context'

const props = defineProps<{
  value: unknown
  label?: string
  disabled?: boolean
}>()

const ctx = inject(SelectContextKey, null)

onMounted(() => {
  ctx?.addOption(props.value, props.label ?? String(props.value))

  return () => ctx?.removeOption(props.value)
})

function handleChange() {
  ctx?.change(props.value)
}
</script>

<template>
  <div class="k-option" :class="{ 'is-disabled': disabled }" @click="handleChange">
    <slot>
      {{ label ?? String(value) }}
    </slot>
  </div>
</template>

<style lang="less">
.k-option {
  cursor: pointer;
  @apply px-2;
  &:hover {
    @apply bg-light-200;
  }
}
</style>
