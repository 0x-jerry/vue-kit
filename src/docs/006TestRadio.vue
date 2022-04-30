<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v1: true,
  v2: true,
})
</script>

<template>
  <test-box title="Radio">
    <k-radio v-model="data.v1" :value="true"> {{ data.v1 }}</k-radio>
    <k-radio v-model="data.v2" :value="false">{{ data.v2 }}</k-radio>
  </test-box>
</template>
