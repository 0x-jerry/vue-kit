<script lang="ts" setup>
defineProps<{
  modelValue: any
}>()

defineEmits({
  'update:modelValue'(val: any) {
    return true
  },
})
</script>

<template>
  <slot></slot>
</template>
