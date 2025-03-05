<script lang='ts' setup>
import type { FieldItemProps } from '@0x-jerry/vue-kit/components/v-form'
import { useId } from 'vue';

export interface P extends FieldItemProps {

}

const props = defineProps<P>()

const fieldId = useId()

</script>

<template>
  <div>
    <slot class="w-full" :id="fieldId" :label="item.label" :error-messages="fieldError?.errors"></slot>
  </div>
</template>

<style lang='less' scoped></style>