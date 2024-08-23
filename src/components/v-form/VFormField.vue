<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from './hooks/useForm'
import { getValue, setValue } from './utils'
import type { VFormFieldProps } from './types'
import { ensureArray } from '@0x-jerry/utils'

const props = defineProps<VFormFieldProps>()

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const formCtx = useForm()!

const fieldPath = computed(() => ensureArray(props.field))

const model = computed({
  get() {
    return getValue(formCtx.data.value, fieldPath.value)
  },
  set(value) {
    return setValue(formCtx.data.value, fieldPath.value, value)
  },
})
</script>

<template>
  <div class="v-form-field">
    <slot :modelValue="model" @update:modelValue="v => model = v"></slot>
  </div>
</template>
