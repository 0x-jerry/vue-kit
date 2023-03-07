<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v: 'input value',
})
</script>

<template>
  <test-box title="Input">
    <div class="flex gap-sm">
      <k-input v-model="data.v" />
      <k-input v-model="data.v" />
      <k-input v-model="data.v" disabled />
      <k-input modelValue="" placeholder="this is a placeholder" />
    </div>
  </test-box>
</template>
