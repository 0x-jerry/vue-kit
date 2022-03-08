<script lang="ts" setup>
defineProps<{
  disabled: Boolean
}>()
</script>

<template>
  <button class="k-button">
    <slot></slot>
  </button>
</template>

<style lang="less">
.k-button {
  @apply px-2 py-1;
  @apply border border-gray-200;
}
</style>
