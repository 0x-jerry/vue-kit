<script lang="ts" setup>
import KRadio from './KRadio.vue'
import { type RadioGroupContext, useRadioGroupContext } from './context'
import { useTheme } from '@/hooks'

interface Option {
  label: string | number | boolean
  value: any
}

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
  options?: Option[]
}>()

const emit = defineEmits({
  'update:modelValue': (val: any) => true,
})

const { cls } = useTheme()

const ctx: RadioGroupContext = {
  get value() {
    return props.modelValue
  },
  get disabled() {
    return !!props.disabled
  },
  change(val) {
    if (props.disabled) return

    emit('update:modelValue', val)
  },
}

useRadioGroupContext.provide(ctx)
</script>

<template>
  <div :class="cls('radio-group')">
    <slot>
      <KRadio
        v-for="item in options || []"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </slot>
  </div>
</template>
