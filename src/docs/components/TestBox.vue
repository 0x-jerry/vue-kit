<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <div class="test-title text-xl font-bold px-2 py-4">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <k-col>
      <slot></slot>
    </k-col>
  </div>
</template>

<style></style>
