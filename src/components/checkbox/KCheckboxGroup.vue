<script lang="ts" setup>
import KCheckbox from './KCheckbox.vue'
import { useTheme } from '@/hooks'
import { CheckboxGroupContext, CheckboxGroupContextKey } from './context'

interface Option {
  label: string | number | boolean
  value: any
}

const props = defineProps<{
  modelValue: unknown[]
  disabled?: boolean
  options?: Option[]
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown[]) => true,
})

const { cls } = useTheme()

const ctx: CheckboxGroupContext = {
  get value() {
    return props.modelValue
  },
  get disabled() {
    return !!props.disabled
  },
  change(val, selected) {
    if (props.disabled) return

    const v = [...props.modelValue]

    if (selected) {
      v.push(val)
    } else {
      const idx = v.indexOf(val)
      v.splice(idx, 1)
    }

    emit('update:modelValue', [...new Set(v)])
  },
}

provide(CheckboxGroupContextKey, ctx)
</script>

<template>
  <div :class="cls('checkbox-group')">
    <slot>
      <KCheckbox
        v-for="item in options || []"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </slot>
  </div>
</template>
