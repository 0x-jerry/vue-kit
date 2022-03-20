<script lang="ts" setup>
import { useGlobalClickEvent } from '@/hooks/useMouseEvent'
import { KMenuButton, KMenuDivide, KMenuItem } from './types'

const props = withDefaults(
  defineProps<{
    showIcon?: boolean
    menus: KMenuItem[]
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
  () => {
    pos.x = mouse.x.value
    pos.y = mouse.y.value
  },
)

useGlobalClickEvent(() => hideMenu())

const contextMenuStyle = computed(() => {
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    z: props.z,
    minWidth: typeof props.minWidth === 'string' ? props.minWidth : `${props.minWidth}px`,
  }
})

function setVisible(val: boolean) {
  visible.value = val
  emit('update:modelValue', val)
}

function showMenu(e: MouseEvent) {
  if (props.customOpenMenu) return

  e.preventDefault()
  setVisible(true)
}

function hideMenu() {
  if (props.customOpenMenu) return

  setVisible(false)
}

function handleClick(item: KMenuButton, e: MouseEvent) {
  if (item.disabled) {
    e.stopPropagation()
    return
  }

  setVisible(false)

  item.onclick?.()
}

function isDivide(item: KMenuItem): item is KMenuDivide {
  return item === 'divide'
}

function isButton(item: KMenuItem): item is KMenuButton {
  return item !== 'divide'
}
</script>

<template>
  <div class="k-context-menu--container" @contextmenu="showMenu" @click="hideMenu">
    <slot></slot>

    <div
      class="k-context-menu"
      :style="contextMenuStyle"
      v-show="isVisible"
      v-if="menus.length"
      @click.stop
    >
      <template v-for="o in menus">
        <div
          class="k-context-menu--item"
          v-if="isButton(o)"
          @click="handleClick(o, $event)"
          :disabled="o.disabled"
        >
          <i class="k-context-menu--icon" v-if="showIcon">
            <component :is="o.icon"></component>
          </i>
          <div class="k-context-menu--label">{{ o.content }}</div>
        </div>
        <div class="k-context-menu--divide" v-else-if="isDivide(o)"></div>
      </template>
    </div>
  </div>
</template>

<style lang="less">
.k- {
  &context-menu {
    &--container {
      @apply relative inline-block;
    }

    @apply fixed left-0 top-0;
    @apply select-none;
    @apply py-2 rounded;
    box-shadow: 0 0 10px #e6e6e6;
    @apply bg-white;

    &--item {
      @apply bg-transparent;
      @apply transition transition-colors;
      @apply px-2 py-1 mx-2 my-1 rounded;
      @apply flex items-center gap-2;
      @apply text-gray-400;
      @apply text-base;

      &:hover {
        @apply bg-gray-100;
        @apply text-gray-700;
      }

      &[disabled] {
        cursor: not-allowed;
        // @apply bg-;
        @apply text-gray-300;

        &:hover {
          @apply text-gray-300;
        }
      }
    }

    &--divide {
      height: 1px;
      width: 100%;
      @apply bg-gray-200;
      @apply my-2;
    }

    &--icon {
      display: contents;
      @apply text-lg;
    }
  }
}
</style>
