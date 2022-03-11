<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v1: '',
})
</script>

<template>
  <test-box title="Input">
    <k-input v-model="data.v1" />
  </test-box>
</template>
