<script lang="ts" setup>
import { useTheme } from '@/hooks'
import { useCheckboxGroupContext } from './context';

const props = defineProps<{
  modelValue?: boolean
  value: unknown
  label?: string | boolean | number
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

const ctx = useCheckboxGroupContext()

const { cls } = useTheme()

const checked = computed(() => (ctx ? ctx.value.includes(props.value) : props.modelValue))

const isDisabled = computed(() => props.disabled || ctx?.disabled)

const slots = useSlots()

function handleChange() {
  emit('update:modelValue', !checked.value)

  ctx?.change(props.value, !checked.value)
}
</script>

<template>
  <label :class="cls('checkbox')">
    <div class="el"></div>
    <input
      hidden
      type="checkbox"
      :checked="checked"
      :value="value"
      @change="handleChange"
      :disabled="isDisabled"
    />
    <span :class="cls('checkbox-content')" v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
