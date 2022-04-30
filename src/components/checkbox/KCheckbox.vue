<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()
</script>

<template>
  <input type="radio" :checked="modelValue" />
</template>

<style lang="less">
.k-qr-code {
  @apply inline-block;
  @apply p-4;
  @apply border border-solid border-gray-100;
}
</style>
