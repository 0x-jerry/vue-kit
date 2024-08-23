<script setup lang="ts">
import { toRaw } from 'vue'
import { VLayout } from '../v-layout'
import { useForm } from './hooks/useForm'
import type { VFormProps } from './types'

const props = defineProps<VFormProps>()
const emit = defineEmits(['submit'])

const formCtx = useForm.provide()
formCtx.update(props.data)

async function onSubmit() {
  const errors = await formCtx.validate()
  if (errors.length) {
    throw errors
  }

  const clonedData = structuredClone(toRaw(formCtx.data.value))
  emit('submit', clonedData)
}

defineExpose({
  formContext: formCtx,
})
</script>

<template>
  <form class="v-form" @submit.prevent="onSubmit">
    <VLayout v-bind="props.layout">
      <slot></slot>
    </VLayout>
  </form>
</template>
