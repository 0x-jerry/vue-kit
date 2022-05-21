<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import KRow from '@/components/layout/KRow.vue'

const data = reactive({
  v: false,
})
</script>

<template>
  <test-box title="Switch">
    <k-row>
      <span> false: </span>
      <k-switch :modelValue="false"></k-switch>
      <span> true: </span>
      <k-switch :modelValue="true"></k-switch>
      <span> interactive: </span>
      <k-switch v-model="data.v"></k-switch>
      <span> disabled: </span>
      <k-switch :modelValue="data.v" disabled></k-switch>
    </k-row>
  </test-box>
</template>
