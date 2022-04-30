<script lang="ts" setup>
import { CheckboxGroupContextKey } from './hooks'

const props = defineProps<{
  modelValue?: boolean
  value: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})
const ctx = inject(CheckboxGroupContextKey, null)

const checked = computed(() => (ctx ? ctx.value.includes(props.value) : props.modelValue))

const isDisabled = computed(() => props.disabled || ctx?.disabled)

const slots = useSlots()

function handleChange() {
  emit('update:modelValue', !checked.value)

  ctx?.change(props.value, !checked.value)
}
</script>

<template>
  <template v-if="slots.default">
    <label class="k-checkbox--label" :class="{ 'is-disabled': isDisabled }">
      <input
        class="k-radio"
        type="checkbox"
        :checked="checked"
        :value="value"
        @change="handleChange"
        :disabled="isDisabled"
      />
      <slot></slot>
    </label>
  </template>
  <template v-else>
    <input
      class="k-checkbox"
      type="checkbox"
      :checked="checked"
      :value="value"
      @change="handleChange"
      :disabled="isDisabled"
    />
  </template>
</template>

<style lang="less">
.k-checkbox--label {
  cursor: pointer;

  &.is-disabled {
    cursor: not-allowed;
  }

  .k-checkbox {
    @apply mr-2;
  }
}

.k-checkbox {
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
