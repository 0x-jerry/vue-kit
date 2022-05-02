<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?: 'left' | 'right'
    noLock?: boolean
    title?: string
  }>(),
  {
    placement: 'right',
  },
)

const slots = useSlots()

const lockScroll = useScrollLock(document.documentElement)

watch(
  () => props.modelValue,
  () => {
    if (props.noLock) return

    if (props.modelValue) {
      lockScroll.value = true
    }
  },
  {
    immediate: true,
  },
)

const emit = defineEmits({
  'update:modelValue': (val: boolean) => true,
})

function hide() {
  emit('update:modelValue', false)
}
</script>

<template>
  <teleport to="body">
    <k-fade :offset="0" @after-leave="lockScroll = false">
      <div class="k-drawer" :class="[`is-${placement}`]" v-show="props.modelValue">
        <div class="k-drawer--bg" @click="hide"></div>
        <div class="k-drawer--content">
          <div class="k-drawer--head" v-if="slots.head || title">
            <slot name="head">
              {{ title }}
            </slot>
          </div>

          <div class="k-drawer--content__inner">
            <slot></slot>
          </div>

          <div class="k-drawer--footer" v-if="slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </k-fade>
  </teleport>
</template>

<style lang="less">
.k-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  &--bg {
    background: rgba(0, 0, 0, 10%);
    width: 100%;
    height: 100%;
  }

  &--content {
    position: absolute;
    top: 0;
    z-index: 1;
    min-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;

    @apply bg-white shadow-lg;

    &__inner {
      flex: 1;
      overflow: auto;
    }
  }

  &--head,
  &--footer,
  &--content__inner {
    @apply px-3 py-2;
  }

  &--head {
    border-bottom: 1px solid;
    @apply border-gray-100;
  }

  &--footer {
    border-top: 1px solid;
    @apply border-gray-100;
  }

  &.is-left {
    .k-drawer--content {
      left: 0;
    }
  }

  &.is-right {
    .k-drawer--content {
      right: 0;
    }
  }
}
</style>
