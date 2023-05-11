<script lang="ts" setup>
import { KContextMenuContextKey } from './context'
import type { KMenuButton, KMenuDivide, KMenuItem } from './types'

const props = withDefaults(
  defineProps<{
    showIcon?: boolean
    menus?: KMenuItem[]
    minWidth?: number | string
    z?: number
    modelValue?: boolean
    customOpenMenu?: boolean
  }>(),
  {
    z: 1000,
    minWidth: 150,
    showIcon: true,
    customOpenMenu: false,
    menus: () => [],
  },
)

const emit = defineEmits({
  'update:modelValue': (val: boolean) => true,
})

const mouse = useMouse()

const pos = reactive({
  x: 0,
  y: 0,
})

const visible = ref(false)

const isVisible = computed(() => {
  return props.customOpenMenu ? props.modelValue : visible.value
})

watch(
  () => isVisible.value,
  (val) => {
    if (val) {
      updateMenuPosition()
    }
  },
)

useEventListener('click', () => hideMenu())

const contextMenuStyle = computed(() => {
  return {
    // transform: `translate(${pos.x}px, ${pos.y}px)`,
    top: pos.y + 'px',
    left: pos.x + 'px',
    zIndex: props.z,
    minWidth: typeof props.minWidth === 'string' ? props.minWidth : `${props.minWidth}px`,
  }
})

function setVisible(val: boolean) {
  visible.value = val
  emit('update:modelValue', val)
}

function showMenu(e: MouseEvent) {
  if (props.customOpenMenu) return

  updateMenuPosition()

  e.preventDefault()
  setVisible(true)
}

function close() {
  setVisible(false)
}

provide(KContextMenuContextKey, {
  close,
})

function hideMenu() {
  if (props.customOpenMenu) return
  if (!unref(visible)) return

  setVisible(false)
}

function isDivide(item: KMenuItem): item is KMenuDivide {
  return item === 'divide'
}

function isButton(item: KMenuItem): item is KMenuButton {
  return item !== 'divide'
}

function updateMenuPosition() {
  pos.x = mouse.x.value - window.scrollX
  pos.y = mouse.y.value - window.scrollY
}
</script>

<template>
  <div class="k-context-menu--container" @contextmenu="showMenu" @click="hideMenu">
    <slot name="reference"></slot>

    <transition name="k-context-menu">
      <div class="k-context-menu" :style="contextMenuStyle" v-show="isVisible" @click.stop>
        <slot>
          <template v-for="o in menus">
            <k-context-menu-item v-if="isButton(o)" @click="o.onclick!" v-bind="o">
            </k-context-menu-item>
            <k-context-menu-divide v-if="isDivide(o)"></k-context-menu-divide>
          </template>
        </slot>
      </div>
    </transition>
  </div>
</template>

<style lang="less">
.k-context-menu {
  &--container {
    @apply relative inline-block;
  }

  @apply fixed left-0 top-0;
  @apply select-none;
  @apply py-2 rounded;
  box-shadow: 0 0 10px #e6e6e6;
  @apply bg-white;

  &-enter-active,
  &-leave-active {
    @apply transition ease-in-out;
    transition-property: transform opacity;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
