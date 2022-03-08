<script lang="ts" setup>
import IconPlay from '~icons/mdi/play'
import IconPause from '~icons/mdi/pause'

defineProps<{
  paused: boolean
}>()
</script>

<template>
  <span class="v-controls-btn v-controls-play">
    <icon-play v-if="$props.paused" />
    <icon-pause v-else />
  </span>
</template>

<style lang="less">
.v-controls {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &-btn {
    cursor: pointer;
    color: rgb(90, 90, 90);
    transition: colors 0.4s ease;
    display: inline-flex;

    &:hover {
      color: rgb(3, 3, 3);
    }
  }

  &-play {
    font-size: large;
  }
}
</style>
