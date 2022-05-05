<script lang="ts" setup>
import { useToastConfig } from './config'
import { toastCtx, ToastInstance } from './context'
import { toastProps } from './props'

toastCtx.installed = 'component'

const props = defineProps(toastProps)

const conf = useToastConfig(props)

function stopTimeout(ins: ToastInstance) {
  ins.stopAutoClose()
}

function continueTimeout(ins: ToastInstance) {
  ins.continueAutoClose()
}
</script>

<template>
  <k-col class="k-toast--group" :class="[`is-${conf.position}`]">
    <transition-group name="k-toast">
      <div
        class="k-toast"
        v-for="item in toastCtx.instances"
        :key="item.id"
        :class="[`is-${item.type}`]"
        @mouseenter="stopTimeout(item)"
        @mouseleave="continueTimeout(item)"
      >
        {{ item.message }}
      </div>
    </transition-group>
  </k-col>
</template>

<style lang="less">
.k-toast,
.k-toast-enter-active,
.k-toast-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.k-toast-enter-from,
.k-toast-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.k-toast-leave-active {
  position: absolute;
}

.k-toast {
  max-width: 400px;
  min-width: 300px;
  border: 1px solid;

  @apply bg-light-50;
  @apply border-gray-300;
  @apply px-4 py-2;

  &.is-warning {
    @apply border-yellow-500;
  }

  &.is-error {
    @apply border-red-500;
  }

  &.is-info {
    @apply border-gray-500;
  }

  &.is-success {
    @apply border-green-500;
  }

  &--group {
    @offset: 5px;
    position: fixed;
    top: @offset;

    &.is-left {
      left: @offset;
    }

    &.is-right {
      right: @offset;
    }
  }
}
</style>
