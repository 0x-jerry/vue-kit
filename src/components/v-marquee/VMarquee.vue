<script lang="ts" setup>
import { useElementHover, useElementSize, useRafFn, useScroll } from '@vueuse/core'
import { ref } from 'vue'
import type { VMarqueeProps } from './types';

const { speed = 200, gap = 8 } = defineProps<VMarqueeProps>()

const containerEl = ref()
const contentEl = ref()

const contentSize = useElementSize(contentEl)

const scrollState = useScroll(containerEl)

const isHovering = useElementHover(containerEl)

useRafFn(({ delta }) => {
  const dx = isHovering.value ? 0 : (delta / 1000) * speed

  const contentWidthWithGap = contentSize.width.value + gap

  let x = scrollState.x.value + dx

  if (x > contentWidthWithGap * 2 || x < contentWidthWithGap) {
    x = (x % contentWidthWithGap) + contentWidthWithGap
  }

  scrollState.x.value = x
})
</script>

<template>
  <div class="v-marquee" ref="containerEl" :style="{ gap: `${gap}px` }">
    <div class="v-marquee-content" ref="contentEl">
      <slot></slot>
    </div>
    <div class="v-marquee-content">
      <slot></slot>
    </div>
    <div class="v-marquee-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.v-marquee {
  overflow: auto;
  display: flex;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
}

.v-marquee-content {
  width: fit-content;
}
</style>
