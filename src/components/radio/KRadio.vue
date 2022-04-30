<script lang="ts" setup>
const props = defineProps<{
  modelValue: unknown
  value: unknown
}>()

const checked = computed(() => props.value === props.modelValue)

const slots = useSlots()
</script>

<template>
  <template v-if="slots.default">
    <label class="k-radio--label">
      <input class="k-radio" type="radio" :checked="checked" />
      <slot></slot>
    </label>
  </template>
  <template v-else>
    <input class="k-radio" type="radio" :checked="checked" />
  </template>
</template>

<style lang="less">
.k-radio--label {
  .k-radio {
    @apply mr-2;
  }
}

.k-radio {
}
</style>
