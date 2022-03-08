<script lang="ts" setup>
import { computed, reactive, watchEffect } from 'vue'
import IconVolumeLow from '~icons/mdi/volume-low'
import IconVolumeMedium from '~icons/mdi/volume-medium'
import IconVolumeHeight from '~icons/mdi/volume-high'
import IconVolumeMute from '~icons/mdi/volume-mute'
import VProgress from './VProgress.vue'

const props = defineProps<{
  /**
   * 0 - 1
   */
  value?: number
}>()

const data = reactive({
  value: props.value ?? 1,
  cacheValue: props.value ?? 1,
  active: false,
  isChangingVolume: false,
})

const emits = defineEmits<{
  (event: 'update:value', val: number): void
}>()

const isActive = computed(() => data.active || data.isChangingVolume)

const volumeIcon = computed(() => {
  return data.value > 0.6
    ? IconVolumeHeight
    : data.value > 0.3
    ? IconVolumeMedium
    : data.value > 0
    ? IconVolumeLow
    : IconVolumeMute
})

watchEffect(() => {
  emits('update:value', data.value)
})

function switchMute() {
  if (data.value === 0) {
    data.value = data.cacheValue
  } else {
    data.cacheValue = data.value
    data.value = 0
  }
}
</script>

<template>
  <div class="v-volume">
    <span
      @click="switchMute"
      class="v-volume-icon"
      flex="~"
      @mouseenter="data.active = true"
      @mouseleave="data.active = false"
    >
      <component :is="volumeIcon" />
    </span>

    <div
      class="v-volume-progress"
      :class="{ active: isActive }"
      @mouseenter="data.active = true"
      @mouseleave="data.active = false"
    >
      <div class="v-volume-progress__inner">
        <v-progress
          v-model:value="data.value"
          :vertical="true"
          @active-changed="(v: boolean) => (data.isChangingVolume = v)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.v-volume {
  position: relative;

  &-progress {
    position: absolute;
    top: -8px;
    left: 50%;
    opacity: 0;
    transition: opacity ease 0.4s;
    pointer-events: none;
    width: 0;

    &.active {
      pointer-events: all;
      opacity: 1;
    }

    &__inner {
      width: 80px;
      transform: rotate(-90deg);
      transform-origin: left center;
      padding: 10px;
    }
  }
}
</style>
