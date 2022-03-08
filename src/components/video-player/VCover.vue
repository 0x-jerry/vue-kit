<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { resetAnimation } from './utils'

const props = defineProps<{
  src?: string
  paused?: boolean

  /**
   * reset animation
   */
  reset?: any
}>()

const coverAnimationStatus = computed(() => (props.paused ? 'paused' : 'running'))

const el = ref()

watch(
  () => [props.src, props.reset],
  () => {
    if (!el.value) return

    resetAnimation(el.value, 'v-cover-playing')
  }
)
</script>

<template>
  <div class="v-cover">
    <img v-if="src" ref="el" :src="src" class="v-cover-playing" />
  </div>
</template>

<style lang="less">
.v-cover {
  overflow: hidden;
  border-radius: 100%;
  box-shadow: 0 0 20px rgb(233, 233, 233);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.v-cover-playing {
      animation: rotate 10s linear infinite;
      animation-play-state: v-bind('coverAnimationStatus');
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(359deg);
    }
  }
}
</style>
