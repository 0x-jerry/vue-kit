<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({})
</script>

<template>
  <test-box title="Popover">
    <k-row class="items-center">
      Hover:
      <k-popover content="content things">
        <template #reference>
          <div border="~ solid gray-300">Hover me</div>
        </template>
      </k-popover>
      | Click:
      <k-popover content="content things" trigger="click">
        <template #reference>
          <k-button>Click me</k-button>
        </template>
      </k-popover>
      | Hide arrow:
      <k-popover content="content things" trigger="click" hide-arrow>
        <template #reference>
          <k-button>Click me</k-button>
        </template>
      </k-popover>
    </k-row>
    <!--  -->
  </test-box>
</template>
