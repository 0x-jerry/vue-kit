<script lang="ts" setup>
import { sleep } from '@0x-jerry/utils'
import TestBox from './components/TestBox.vue'

const data = reactive({})
</script>

<template>
  <test-box title="Button">
    <div class="flex gap-sm">
      <k-button>Normal</k-button>
      <k-button variety="primary">Primary</k-button>
      <k-button disabled variety="primary">Primary</k-button>
      <k-button @click="sleep(1000)"> Click Props </k-button>
      <k-button disabled>Disabled</k-button>
    </div>
  </test-box>
</template>
