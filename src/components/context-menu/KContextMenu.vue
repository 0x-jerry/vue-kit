<script lang="ts" setup>
import { useGlobalClickEvent } from '@/hooks/useMouseEvent'
import { KContextMenuContextKey } from './context'
import { KMenuButton, KMenuDivide, KMenuItem } from './types'

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
  () => {
    updateMenuPosition()
  },
)

useGlobalClickEvent(() => hideMenu())

const contextMenuStyle = computed(() => {
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
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

  setVisible(false)
}

function isDivide(item: KMenuItem): item is KMenuDivide {
  return item === 'divide'
}

function isButton(item: KMenuItem): item is KMenuButton {
  return item !== 'divide'
}

function updateMenuPosition() {
  pos.x = mouse.x.value
  pos.y = mouse.y.value
}
</script>

<template>
  <div class="k-context-menu--container" @contextmenu="showMenu" @click="hideMenu">
    <slot name="reference"></slot>

    <div class="k-context-menu" :style="contextMenuStyle" v-show="isVisible" @click.stop>
      <template v-if="menus?.length">
        <template v-for="o in menus">
          <k-context-menu-item v-if="isButton(o)" @click="o.onclick!" v-bind="o">
          </k-context-menu-item>
          <k-context-menu-divide v-if="isDivide(o)"></k-context-menu-divide>
        </template>
      </template>

      <template v-else>
        <slot></slot>
      </template>
    </div>
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
}
</style>
