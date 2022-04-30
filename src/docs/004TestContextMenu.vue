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
  <test-box title="Context Menu" class="select-none">
    <k-context-menu :menus="menus">
      <template #reference>
        <div
          w="400px"
          h="100px"
          border="~ gray-300 hover:blue-400"
          flex="~ "
          class="items-center"
          justify="center"
        >
          <span text="gray-300"> Use Right Click To Open Context Menu </span>
        </div>
      </template>
    </k-context-menu>

    <!--  -->

    <k-context-menu :min-width="200">
      <template #reference>
        <div
          w="400px"
          h="100px"
          border="~ gray-300 hover:blue-400"
          flex="~ "
          class="items-center"
          justify="center"
        >
          <span text="gray-300"> Use Right Click To Open Context Menu </span>
        </div>
      </template>

      <k-context-menu-item :icon="EditIcon" suffix="⌘ X"> Edit </k-context-menu-item>
      <k-context-menu-divide></k-context-menu-divide>
      <k-context-menu-item :icon="UndoIcon" disabled suffix="⌘ Z"> Undo </k-context-menu-item>
      <k-context-menu-item :icon="RedoIcon" suffix="⌘ R"> Redo </k-context-menu-item>
    </k-context-menu>
  </test-box>
</template>
