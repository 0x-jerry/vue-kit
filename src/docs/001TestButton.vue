<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({})
</script>

<template>
  <test-box title="Button">
    <k-flex>
      <k-button disabled>Disabled</k-button>
      <k-button disabled>Normal</k-button>
    </k-flex>
  </test-box>
</template>
