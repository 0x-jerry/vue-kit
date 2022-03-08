<script lang="ts" setup>
import { computed, reactive, watch, watchEffect } from 'vue'
import { useDrag } from './utils'

interface LoadedRange {
  /**
   * 0 - 1
   */
  start: number
  /**
   * 0 - 1
   */
  end: number
}

const props = defineProps<{
  /**
   * 0 - 1
   */
  value: number
  ranges?: LoadedRange[]
  theme?: string
  vertical?: boolean
  /**
   * only change value when mouseup triggered
   */
  changeOnUp?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:value', val: number): void
  (event: 'activeChanged', val: boolean): void
}>()

const primaryColor = computed(() => props.theme ?? 'black')

const data = reactive({
  current: props.value,
  active: false,
})

watchEffect(() => {
  emit('activeChanged', data.active)
})

watch(
  () => props.value,
  () => {
    if (data.active) {
      return
    }

    data.current = props.value
  }
)

const startDrag = useDrag({
  start(target, e) {
    data.active = true
    data.current = e.offsetX / target.clientWidth
  },
  update(dx, dy, target) {
    const dd = props.vertical ? -dy : dx

    const current = data.current + dd / target.clientWidth

    data.current = current < 0 ? 0 : current > 1 ? 1 : current

    if (!props.changeOnUp) {
      emit('update:value', data.current)
    }
  },
  end() {
    data.active = false

    emit('update:value', data.current)
  },
})
</script>

<template>
  <div class="v-progress">
    <div class="v-progress__background" @mousedown="startDrag"></div>

    <div
      class="v-progress__loaded"
      v-for="o in props.ranges || []"
      :style="{
        left: `${o.start * 100}%`,
        width: `${(o.end - o.start) * 100}%`,
      }"
    ></div>

    <div
      class="v-progress__current"
      :style="{
        width: `${data.current * 100}%`,
      }"
    ></div>

    <div
      class="v-progress__thumb"
      :class="{
        visible: data.active,
      }"
      :style="{
        left: `${data.current * 100}%`,
      }"
    ></div>
  </div>
</template>

<style lang="less">
.v-progress {
  position: relative;
  cursor: pointer;
  height: 3px;
  width: 100%;
  border-radius: 10px;

  -webkit-user-drag: none;

  * {
    -webkit-user-drag: none;
  }

  &__background {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: v-bind('primaryColor');
    opacity: 10%;
  }

  &__loaded {
    position: absolute;
    border-radius: 10px;
    top: 0;
    pointer-events: none;
    height: 100%;
    background: v-bind('primaryColor');

    z-index: 1;
    opacity: 40%;
  }

  &__current {
    position: absolute;
    border-radius: 10px;
    top: 0;
    pointer-events: none;
    height: 100%;

    z-index: 2;
    background: v-bind('primaryColor');
  }

  @thumb-size: 10px;
  &__thumb {
    position: absolute;
    z-index: 3;
    pointer-events: none;

    width: 0px;
    height: 0px;

    border-radius: 100px;

    top: 50%;
    transform: translate(-50%, -50%);

    background: v-bind('primaryColor');

    transition: all ease 0.4s;
    transition-property: width, height;

    &.visible {
      width: @thumb-size;
      height: @thumb-size;
    }
  }

  &:hover {
    .v-progress__thumb {
      width: @thumb-size;
      height: @thumb-size;
    }
  }
}
</style>
