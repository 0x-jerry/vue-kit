<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

function handleChange() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label>
    <input type="time" />
  </label>
</template>

<style lang="less">
.k-switch--label {
  cursor: pointer;
  width: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &.is-disabled {
    cursor: not-allowed;
  }
}
</style>
