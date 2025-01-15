<script lang='ts' setup>
import Message from 'primevue/message';
import type { FieldItemProps } from '../src/components/v-form/FieldItem.vue';
import { computed, useId } from 'vue';
import FloatLabel from 'primevue/floatlabel';

export interface P extends FieldItemProps {

}

const props = defineProps<P>()

const placeholder = computed(() => props.item.component === 'Input' ? 'Please input' : 'Please select')

const fieldId = useId()
</script>

<template>
  <div class="flex flex-col gap-1">
    <FloatLabel variant="on" class="w-full">
      <slot class="w-full" :id="fieldId" :invalid="!!fieldError"></slot>
      <label :for="fieldId">{{ item.label }}</label>
    </FloatLabel>
    <Message v-if="fieldError" severity="error" size="small" variant="simple">
      {{ fieldError.errors.join('\n') }}
    </Message>
  </div>

</template>

<style lang='less' scoped></style>