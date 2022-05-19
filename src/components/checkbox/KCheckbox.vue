<script lang="ts" setup>
import { CheckboxGroupContextKey } from './context'

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
        class="k-checkbox"
        type="checkbox"
        :checked="checked"
        :value="value"
        @change="handleChange"
        :disabled="isDisabled"
      />
      <span class="k-checkbox--content" v-if="$slots.default">
        <slot></slot>
      </span>
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
  width: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &.is-disabled {
    cursor: not-allowed;
  }
}

.k-checkbox {
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &--content {
    @apply ml-1;
  }
}
</style>
