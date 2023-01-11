<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { KPopover } from '../popover'
import { SelectContext, SelectContextKey } from './context'
import CaretDownIcon from '~icons/carbon/caret-down'

const props = defineProps<{
  modelValue: unknown
  disabled?: boolean
  block?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

const data = reactive({
  expand: false,
  options: new Map(),
})

const selectedOption = computed(() => {
  const label = data.options.get(props.modelValue)

  return {
    value: props.modelValue,
    label,
  }
})

const ele = {
  content: ref<HTMLElement>(),
}

const styles = {
  options: reactive({} as CSSProperties),
}

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

    hideOptions()
    emit('update:modelValue', val)
  },
}

provide(SelectContextKey, ctx)

function syncWidth() {
  const content = unref(ele.content)

  if (!content) return

  styles.options.width = content.clientWidth - 10 + 'px'
}

function toggleOptions() {
  if (props.disabled) return
  syncWidth()

  data.expand = !data.expand
}

function hideOptions() {
  if (!data.expand) return

  data.expand = false
}
</script>

<template>
  <div class="k-select" :class="{ 'is-disabled': props.disabled, 'is-block': props.block }">
    <k-popover
      v-model="data.expand"
      placement="bottom"
      :class="{ 'is-block': props.block }"
      @click-outside="hideOptions"
    >
      <template #reference>
        <div class="k-select--content" @click="toggleOptions" :ref="ele.content">
          <slot name="content" v-bind="selectedOption" :expand="data.expand">
            <div class="flex-1">
              {{ selectedOption.label }}
            </div>
            <div class="k-select--icon" :class="{ 'is-expand': data.expand }">
              <CaretDownIcon />
            </div>
          </slot>
        </div>
      </template>
      <div class="k-select--options" :style="styles.options">
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
    display: flex;

    &:hover {
      @apply border-blue-500;
    }
  }

  &--icon {
    transform: rotate(0);
    @apply transition transition-transform;

    &.is-expand {
      transform: rotate(180deg);
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

  &.is-block {
    display: block;

    .is-block {
      display: block;
    }
  }
}
</style>
