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
    <k-context-menu :menus="menus">
      <div w="400px" h="100px" border="~ gray-300" flex="~ " align="items-center" justify="center">
        <span text="gray-300"> Use Right Click To Open Context Menu </span>
      </div>
    </k-context-menu>
  </test-box>
</template>
