<script lang="ts" setup>
import { RadioGroupContextKey } from './context'

const props = defineProps<{
  modelValue?: unknown
  value: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})
const ctx = inject(RadioGroupContextKey, null)

const checked = computed(() => props.value === (ctx ? ctx.value : props.modelValue))

const isDisabled = computed(() => props.disabled || ctx?.disabled)

const slots = useSlots()

function handleChange() {
  emit('update:modelValue', props.value)

  ctx?.change(props.value)
}
</script>

<template>
  <template v-if="slots.default">
    <label class="k-radio--label" :class="{ 'is-disabled': isDisabled }">
      <input
        class="k-radio"
        type="radio"
        :checked="checked"
        :value="value"
        @change="handleChange"
        :disabled="isDisabled"
      />
      <span class="k-radio--content" v-if="$slots.default">
        <slot></slot>
      </span>
    </label>
  </template>
  <template v-else>
    <input
      class="k-radio"
      type="radio"
      :checked="checked"
      :value="value"
      @change="handleChange"
      :disabled="isDisabled"
    />
  </template>
</template>

<style lang="less">
.k-radio--label {
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &.is-disabled {
    cursor: not-allowed;
  }
}

.k-radio {
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &--content {
    @apply ml-1;
  }
}
</style>
