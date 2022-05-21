<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v: 'input value',
})
</script>

<template>
  <test-box title="Input">
    <k-row>
      <k-input v-model="data.v" />
      <k-input v-model="data.v" />
      <k-input v-model="data.v" disabled />
    </k-row>
  </test-box>
</template>
