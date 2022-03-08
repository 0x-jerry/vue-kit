<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <div class="test-title">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="test-content">
      <slot></slot>
    </div>
  </div>
</template>

<style></style>
