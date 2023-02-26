<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import EditIcon from '~icons/carbon/edit'
import UndoIcon from '~icons/carbon/undo'
import RedoIcon from '~icons/carbon/redo'
import { KMenuItem } from '@/components/context-menu'

const data = reactive({})

const menus: KMenuItem[] = [
  {
    icon: EditIcon,
    content: 'Edit',
    onclick() {
      console.log('Edit')
    },
  },
  'divide',
  {
    icon: UndoIcon,
    content: 'Undo',
    disabled: true,
    onclick() {
      console.log('Undo')
    },
  },
  {
    icon: RedoIcon,
    content: 'Redo',
    onclick() {
      console.log('Redo')
    },
  },
]
</script>

<template>
  <test-box title="Context Menu">
    <k-row class="gap-2">
      <k-context-menu class="flex-1 select-none" :menus="menus">
        <template #reference>
          <div
            class="items-center flex justify-center border-(~ solid gray-3) hover:(border-gray-4) h-100px"
          >
            <span text="gray-300"> Use Right Click To Open Context Menu </span>
          </div>
        </template>
      </k-context-menu>

      <k-context-menu class="flex-1">
        <template #reference>
          <div
            class="items-center flex justify-center border-(~ solid gray-3) hover:(border-gray-4) h-100px"
          >
            <span text="gray-300"> Use Right Click To Open Context Menu </span>
          </div>
        </template>

        <k-context-menu-item :icon="EditIcon" suffix="⌘ X"> Edit </k-context-menu-item>
        <k-context-menu-divide></k-context-menu-divide>
        <k-context-menu-item :icon="UndoIcon" disabled suffix="⌘ Z"> Undo </k-context-menu-item>
        <k-context-menu-item :icon="RedoIcon" suffix="⌘ R"> Redo </k-context-menu-item>
      </k-context-menu>
    </k-row>
  </test-box>
</template>
