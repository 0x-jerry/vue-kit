<script lang="ts" setup>
import { parseStyleProperty } from '@/utils'
import { KFade } from '../transition'
import CloseIcon from '~icons/carbon/close'
import { KButton } from '../button'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?: 'left' | 'right'
    noLock?: boolean
    title?: string
    width?: string | number
    hideCloseButton?: boolean
  }>(),
  {
    placement: 'right',
    width: 500,
  },
)

const slots = useSlots()

const lockScroll = useScrollLock(document.documentElement)

const contentStyle = computed(() => {
  return {
    width: parseStyleProperty(props.width),
  }
})

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
    <div class="k-drawer" :class="[`is-${placement}`]">
      <k-fade offset="0">
        <div class="k-drawer--bg" @click="hide" v-show="props.modelValue"></div>
      </k-fade>

      <transition :name="`k-drawer--animation`" @after-leave="lockScroll = false">
        <div class="k-drawer--content" :style="contentStyle" v-show="props.modelValue">
          <div class="k-drawer--head" v-if="slots.head || title">
            <slot name="head">
              {{ title }}
            </slot>

            <div class="k-drawer--head-close">
              <k-button variety="text" v-if="!hideCloseButton">
                <CloseIcon @click="hide" />
              </k-button>
            </div>
          </div>

          <div class="k-drawer--content__inner">
            <slot></slot>
          </div>

          <div class="k-drawer--footer" v-if="slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style lang="less">
.k-drawer {
  position: fixed;
  top: 0;
  left: 0;

  &--bg {
    background: rgba(0, 0, 0, 10%);
    width: 100vw;
    height: 100vh;
  }

  &--content {
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100vh;
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
    @apply text-2xl;
    @apply py-3;

    display: flex;
    align-items: center;

    &-close {
      flex: 1;
      display: flex;
      justify-content: end;
    }
  }

  &--footer {
    border-top: 1px solid;
    @apply border-gray-100;
    @apply py-3;

    display: flex;
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
.k-drawer {
  .k-drawer--animation {
    &-enter-active,
    &-leave-active {
      @apply transition ease-in-out;
      transition-property: transform opacity;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }

  &.is-left {
    .k-drawer--animation {
      &-enter-from,
      &-leave-to {
        transform: translateX(-100%);
      }
    }
  }

  &.is-right {
    .k-drawer--animation {
      &-enter-from,
      &-leave-to {
        transform: translateX(100%);
      }
    }
  }
}
</style>
