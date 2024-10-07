<script lang="ts" setup>
import {
  useElementHover,
  useElementSize,
  useRafFn,
  useScroll
} from '@vueuse/core'
import { computed, ref } from 'vue'

export interface VMarqueeProps {
  /**
   * @default 200
   */
  speed?: number
  /**
   * @default 8
   */
  gap?: number
}

const { speed = 200, gap = 8 } = defineProps<VMarqueeProps>()

const containerEl = ref()
const contentEl = ref()

const contentSize = useElementSize(contentEl)

const containerSize = useElementSize(containerEl)

const scrollState = useScroll(containerEl)

const isHovering = useElementHover(containerEl)

const boundary = 1

const canScroll = computed(
  () => contentSize.width.value >= containerSize.width.value + boundary
)

useRafFn(({ delta }) => {
  if (!canScroll.value) {
    return
  }

  const dx = isHovering.value ? 0 : (delta / 1000) * speed

  const contentWidthWithGap = contentSize.width.value + gap

  let x = scrollState.x.value + dx

  if (x > boundary + contentWidthWithGap) {
    x = x % contentWidthWithGap
  }

  if (x < boundary) {
    x += contentWidthWithGap
  }

  scrollState.x.value = x
})
</script>

<template>
  <div class="v-marquee" ref="containerEl" :style="{ gap: `${gap}px` }">
    <div class="v-marquee-content" ref="contentEl">
      <slot></slot>
    </div>
    <div class="v-marquee-content" v-if="canScroll">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less">
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
