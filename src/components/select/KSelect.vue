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

const selectedOption = computed(() => {
  const label = data.options.get(props.modelValue)

  return {
    value: props.modelValue,
    label,
  }
})

const ctx: SelectContext = {
  get disabled() {
    return !!props.disabled
  },
  get value() {
    return props.modelValue
  },
  get selected() {
    return selectedOption.value
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

provide(SelectContextKey, ctx)

function toggleOptions() {
  if (props.disabled) return

  data.showOptions = !data.showOptions
}

function hideOptions() {
  data.showOptions = false
}
</script>

<template>
  <div class="k-select" :class="{ 'is-disabled': props.disabled }">
    <k-popover v-model="data.showOptions" placement="bottom">
      <template #reference>
        <div class="k-select--content" @click="toggleOptions">
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
    cursor: pointer;
    @apply border-gray-300;
    @apply rounded-sm;
    @apply px-1;

    &:hover {
      @apply border-blue-500;
    }
  }

  &--options {
    min-width: 100px;
    max-height: 200px;
    @apply py-1;
    display: flex;
    flex-direction: column;
    @apply gap-y-1;
  }

  &.is-disabled {
    .k-select--content {
      @apply border-gray-200;
      @apply color-gray-500;
      cursor: not-allowed;

      &:hover {
        @apply border-gray-200;
      }
    }
  }
}
</style>
