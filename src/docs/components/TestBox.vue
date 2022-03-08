<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <div class="test-title" text="xl" font="bold" p="x-2 y-4">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="test-content" p="x-2">
      <slot></slot>
    </div>
  </div>
</template>

<style></style>
