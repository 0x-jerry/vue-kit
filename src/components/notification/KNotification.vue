<script lang="ts" setup>
//
</script>

<template>
  <transition-group move-class="k-notify">
    <div class="k-notify">
      <!--  -->
    </div>
  </transition-group>
</template>

<style lang="less">
.k-notify,
.k-notify-enter-active,
.k-notify-leave-active {
  transition: all 0.5s ease;
}

.k-notify-enter-from,
.k-notify-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.k-notify-leave-active {
  position: absolute;
}
</style>
