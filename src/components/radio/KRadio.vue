<script lang="ts" setup>
import { useTheme } from '@/hooks'
import { RadioGroupContextKey } from './context'

const props = defineProps<{
  modelValue?: unknown
  value: unknown
  label?: string | boolean | number
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

const { cls } = useTheme()

const ctx = inject(RadioGroupContextKey, null)

const checked = computed(() => props.value === (ctx ? ctx.value : props.modelValue))

const isDisabled = computed(() => props.disabled || ctx?.disabled)

function handleChange() {
  emit('update:modelValue', props.value)

  ctx?.change(props.value)
}
</script>

<template>
  <label :class="cls('radio')">
    <input
      hidden
      type="radio"
      :checked="checked"
      :value="value"
      @change="handleChange"
      :disabled="isDisabled"
    />
    <span class="el"></span>
    <span :class="cls('radio--content')" v-if="$slots.default || label != null">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
