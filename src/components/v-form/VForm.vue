<script setup lang="ts">
import { VLayout } from "../v-layout";
import { useForm } from "./hooks/useForm";
import type { VFormProps } from "./types";

const props = defineProps<VFormProps>();

const formCtx = useForm.provide();

// todo, check this usage
async function onSubmit() {
  await formCtx.validate();
}

defineExpose({
  formContext: formCtx,
});
</script>

<template>
  <form class="v-form" @submit.prevent="onSubmit">
    <VLayout v-bind="props.layout">
      <slot></slot>
    </VLayout>
  </form>
</template>
