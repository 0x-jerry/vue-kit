<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v: false,
  v2: 4,
})
</script>

<template>
  <test-box title="Select">
    <k-row>
      <k-select v-model="data.v">
        <k-option :value="4"></k-option>
        <k-option :value="true"></k-option>
        <k-option :value="false"></k-option>
        <k-option value="ff"></k-option>
      </k-select>

      <k-select v-model="data.v2">
        <k-option :value="4"></k-option>
        <k-option :value="true"></k-option>
        <k-option :value="false" disabled></k-option>
        <k-option value="ff"></k-option>
      </k-select>
    </k-row>
  </test-box>
</template>
