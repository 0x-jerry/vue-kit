<script lang="ts" setup>
defineProps<{ visible: boolean; zIndex?: number }>()
</script>

<template>
  <transition name="fade">
    <div
      class="fixed w-screen h-screen top-0 left-0"
      :style="`z-index: ${zIndex || 100};`"
      bg="opacity-70 gray-200"
      v-show="visible"
    >
      <slot> </slot>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
