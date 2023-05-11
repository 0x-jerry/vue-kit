<script lang="ts" setup>
import { isNullish } from '@0x-jerry/utils'
import { type CSSProperties } from 'vue'
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoPlacement,
  type Placement,
  type ComputePositionReturn,
  type Middleware,
} from '@floating-ui/dom'
import { KFade } from '../transition'
import { useClickOutEl } from '@/hooks'

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
    autoUpdate?: boolean
  }>(),
  {
    modelValue: undefined,
    trigger: 'hover',
    delay: 200,
  },
)

const emit = defineEmits({
  'update:modelValue': (val: boolean) => true,
  clickOutside: () => true,
})

const ele = {
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

const isCustomTrigger = computed(() => !isNullish(props.modelValue))

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
  () => update(),
)

const hidePopover = () => {
  if (unref(isCustomTrigger)) return

  if (!unref(isVisible)) return

  emit('update:modelValue', false)
}

onUnmounted(() => {
  clearTimeout(delayHandler)
  window.removeEventListener('click', hidePopover)
})

onMounted(() => {
  window.addEventListener('click', hidePopover)
})

if (props.autoUpdate) {
  useMutationObserver(ele.ref, () => update(), {
    attributes: true,
  })
}

async function update() {
  if (!isVisible.value) return

  if (!ele.ref.value || !ele.content.value) return

  const middleware: Middleware[] = [
    props.placement ? flip() : autoPlacement(),
    offset(6),
    shift({ padding: 5 }),
  ]

  if (!props.hideArrow && ele.arrow.value) {
    middleware.push(arrow({ element: ele.arrow.value }))
  }

  const pos = await computePosition(ele.ref.value, ele.content.value, {
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
    left: !isNullish(arrow.x) ? `${arrow.x}px` : '',
    top: !isNullish(arrow.y) ? `${arrow.y}px` : '',
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

useClickOutEl([ele.ref, ele.content], () => {
  if (isTriggerByClick) {
    data.visible = false
  } else if (isTriggerByHover) {
    mouseleave()
  }

  emit('clickOutside')
})
</script>

<template>
  <div
    class="k-popover--reference inline-block"
    :ref="ele.ref"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot name="reference"></slot>
  </div>

  <teleport to="body">
    <k-fade>
      <div
        class="k-popover--content"
        :ref="ele.content"
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
          :ref="ele.arrow"
          :style="styles.arrow"
        ></div>
      </div>
    </k-fade>
  </teleport>
</template>

<style lang="less">
.k-popover {
  display: block;

  &--content {
    position: fixed;
    padding: 5px;
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
