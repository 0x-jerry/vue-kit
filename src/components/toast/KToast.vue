<script lang="ts" setup>
import { useToastConfig } from './config'
import { toastCtx } from './context'

toastCtx.installed = 'component'

const conf = useToastConfig()
</script>

<template>
  <div class="k-toast--group" :class="[`is-${conf.position}`]">
    <transition-group move-class="k-toast">
      <div class="k-toast" v-for="item in toastCtx.instances" :key="item.id">
        {{ item.message }}
      </div>
    </transition-group>
  </div>
</template>

<style lang="less">
.k-toast,
.k-toast-enter-active,
.k-toast-leave-active {
  transition: all 0.5s ease;
}

.k-toast-enter-from,
.k-toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
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

  &--group {
    position: fixed;
    top: 0;

    &.is-left {
      left: 0;
    }

    &.is-right {
      right: 0;
    }
  }
}
</style>
