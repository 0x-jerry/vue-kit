<script lang="ts" setup>
import { is } from '@0x-jerry/utils'
import { CSSProperties } from 'vue'
import {
  computePosition,
  Placement,
  flip,
  shift,
  offset,
  arrow,
  ComputePositionReturn,
  autoPlacement,
  Middleware,
} from '@floating-ui/dom'
import { KFade } from '../transition'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?: Placement
    content?: string
    trigger?: 'hover' | 'click'
    /**
     * Delay to hide, only take effect when trigger by hover.
     *
     * @default 200 ms
     */
    delay?: number
    hideArrow?: boolean
  }>(),
  {
    modelValue: undefined,
    trigger: 'hover',
    delay: 200,
  },
)

const emit = defineEmits({
  'update:modelValue': (val: boolean) => true,
})

const el = {
  ref: ref<HTMLElement>(),
  content: ref<HTMLElement>(),
  arrow: ref<HTMLElement>(),
}

const data = reactive({
  visible: false,
})

const styles = {
  content: reactive({} as CSSProperties),
  arrow: reactive({} as CSSProperties),
}

const isCustomTrigger = computed(() => !is.nullish(props.modelValue))

const isTriggerByHover = computed(() => !unref(isCustomTrigger) && props.trigger === 'hover')
const isTriggerByClick = computed(() => !unref(isCustomTrigger) && props.trigger === 'click')

const isVisible = computed(() => props.modelValue ?? data.visible)

let delayHandler: any

useScroll(document, {
  onScroll() {
    update()
  },
})

watch(
  () => isVisible.value,
  () => {
    update()
  },
)

onUnmounted(() => {
  clearTimeout(delayHandler)
})

onMounted(() => {
  const hidePopover = () => emit('update:modelValue', false)

  window.addEventListener('click', hidePopover)

  return () => window.removeEventListener('click', hidePopover)
})

async function update() {
  if (!isVisible.value) return

  if (!el.ref.value || !el.content.value) return

  const middleware: Middleware[] = [
    props.placement ? flip() : autoPlacement(),
    offset(6),
    shift({ padding: 5 }),
  ]

  if (!props.hideArrow && el.arrow.value) {
    middleware.push(arrow({ element: el.arrow.value }))
  }

  const pos = await computePosition(el.ref.value, el.content.value, {
    strategy: 'fixed',
    placement: props.placement,
    middleware,
  })

  Object.assign(styles.content, {
    left: pos.x + 'px',
    top: pos.y + 'px',
  })

  updateArrow(pos)
}

function updateArrow(pos: ComputePositionReturn) {
  const arrow = pos.middlewareData.arrow
  if (!arrow) return

  const staticSide = (
    {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    } as const
  )[pos.placement.split('-')[0]]!

  Object.assign(styles.arrow, {
    left: !is.nullish(arrow.x) ? `${arrow.x}px` : '',
    top: !is.nullish(arrow.y) ? `${arrow.y}px` : '',
    right: '',
    bottom: '',
    [staticSide]: '-4px',
  })
}

async function mouseenter() {
  if (!unref(isTriggerByHover)) return

  clearTimeout(delayHandler)

  data.visible = true
}

function mouseleave() {
  if (!unref(isTriggerByHover)) return

  clearTimeout(delayHandler)
  delayHandler = setTimeout(() => {
    data.visible = false
  }, props.delay)
}

function handleClick() {
  if (!unref(isTriggerByClick)) return

  data.visible = !data.visible
}
</script>

<template>
  <div class="k-popover" @click.stop :class="{ 'by-hover': trigger === 'hover' }">
    <div
      class="k-popover--reference inline-block"
      :ref="el.ref"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      @click="handleClick"
    >
      <slot name="reference"></slot>
    </div>
    <k-fade>
      <div
        class="k-popover--content"
        :ref="el.content"
        :style="styles.content"
        v-show="isVisible"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >
        <slot>
          {{ content }}
        </slot>
        <div
          class="k-popover--arrow"
          v-if="!props.hideArrow"
          :ref="el.arrow"
          :style="styles.arrow"
        ></div>
      </div>
    </k-fade>
  </div>
</template>

<style lang="less">
.k-popover {
  display: block;

  &--content {
    position: fixed;
    padding: 6px;
    border-radius: 4px;

    box-shadow: 0 5px 10px #cecece, 0 0 10px #cecece;
    @apply bg-white;
  }

  &--arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);

    @apply bg-white;
  }
}
</style>
