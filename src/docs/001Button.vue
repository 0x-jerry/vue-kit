<script lang="ts" setup>
import { sleep } from '@0x-jerry/utils'
import TestBox from './components/TestBox.vue'

const data = reactive({})
</script>

<template>
  <test-box title="Button">
    <k-flex>
      <k-button>Normal</k-button>
      <k-button :click="() => sleep(1000)"> Click Props </k-button>
      <k-button disabled>Disabled</k-button>
    </k-flex>
  </test-box>
</template>
