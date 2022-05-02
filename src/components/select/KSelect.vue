<script lang="ts" setup>
import { SelectContext, SelectContextKey } from './context'

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

const data = reactive({
  showOptions: false,
  options: new Map(),
})

const ctx: SelectContext = {
  get disabled() {
    return !!props.disabled
  },
  get value() {
    return props.modelValue
  },
  addOption(val, label) {
    if (data.options.has(val)) {
      console.warn('Duplicate option value:', val)
      return
    }

    data.options.set(val, label)
  },
  removeOption(val) {
    data.options.delete(val)
  },
  change(val: unknown) {
    if (props.disabled) return

    emit('update:modelValue', val)
    hideOptions()
  },
}

const selectedOption = computed(() => {
  const label = data.options.get(props.modelValue)

  return {
    value: props.modelValue,
    label,
  }
})

provide(SelectContextKey, ctx)

function showOptions() {
  data.showOptions = true
}

function hideOptions() {
  data.showOptions = false
}
</script>

<template>
  <div class="k-select">
    <k-popover v-model="data.showOptions" placement="bottom">
      <template #reference>
        <div class="k-select--content" @click="showOptions">
          <slot name="content" v-bind="selectedOption">
            {{ selectedOption.label }}
          </slot>
        </div>
      </template>
      <div class="k-select--options">
        <slot></slot>
      </div>
    </k-popover>
  </div>
</template>

<style lang="less">
.k-select {
  &--content {
    min-width: 100px;
    min-height: 1em;
    border: 1px solid;
    @apply border-gray-300;
    @apply rounded-sm;
    @apply px-1;
  }

  &--options {
    min-width: 100px;
    max-height: 200px;
    @apply py-1;
  }
}
</style>
