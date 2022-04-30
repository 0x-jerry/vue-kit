<script lang="ts" setup>
import { SelectContextKey } from './context'

const props = defineProps<{
  value: unknown
  disabled?: boolean
}>()

const ctx = inject(SelectContextKey, null)

function handleChange() {
  ctx?.change(props.value)
}
</script>

<template>
  <option :value="value" :disabled="disabled" @click="handleChange">
    <slot>
      {{ value }}
    </slot>
  </option>
</template>

<style></style>
