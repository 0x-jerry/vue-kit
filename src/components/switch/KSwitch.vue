<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits({
  'update:modelValue': (val: unknown) => true,
})

function toggle() {
  if (props.disabled) return

  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label
    class="k-switch-box"
    :class="{ 'is-active': props.modelValue, 'is-disabled': props.disabled }"
    @click.prevent="toggle"
  >
    <button class="k-switch-dot"></button>
  </label>
</template>

<style lang="less">
@dot-size: 1rem;
.k-switch-box {
  @padding: 2px;
  width: @dot-size * 2.5;
  height: calc(@dot-size + @padding * 2);
  padding: 0 @padding 0;

  border: 1px solid;
  @apply border-gray-300;
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
  @apply transition transition-colors;

  &:hover {
    .k-switch-dot {
      @apply bg-gray-500;
    }
  }

  &.is-active {
    @apply border-blue-400;
    .k-switch-dot {
      @apply bg-blue-400;

      transform: translate(150%, -50%);
    }

    &:hover {
      .k-switch-dot {
        @apply bg-blue-500;
      }
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    @apply border-gray-200;

    .k-switch-dot {
      @apply bg-gray-300;
    }
  }
}

.k-switch-dot {
  border: none;
  width: @dot-size;
  height: @dot-size;
  border-radius: 9999px;
  pointer-events: none;

  position: absolute;
  top: 50%;
  left: 2px;
  transform: translate(0, -50%);

  @apply bg-gray-400;

  @apply transition;
  transition-duration: color, background-color, border-color, transform;
}
</style>
