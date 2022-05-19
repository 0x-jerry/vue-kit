<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v: false,
})
</script>

<template>
  <test-box title="Switch">
    <k-switch :modelValue="false"></k-switch>
    <k-switch :modelValue="true"></k-switch>
    <k-switch v-model="data.v"></k-switch>
    <k-switch :modelValue="data.v" disabled></k-switch>
  </test-box>
</template>
