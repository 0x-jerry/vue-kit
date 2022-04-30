<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v1: [true],
  v2: [],
})

const values = [1, 2, 3]
</script>

<template>
  <test-box title="Radio">
    <k-row>
      <span>Checkbox: </span>
      <k-checkbox v-for="(v, idx) in values" v-model="data.v1[idx]" :value="v"> {{ v }}</k-checkbox>
      <k-checkbox v-model="data.v1[3]" :value="4" disabled> {{ 4 }}</k-checkbox>
    </k-row>
    <k-row>
      <span>Radio Group: </span>
      <k-checkbox-group v-model="data.v2">
        <k-checkbox value="ff"> ff </k-checkbox>
        <k-checkbox :value="true"> {{ true }}</k-checkbox>
        <k-checkbox :value="false"> {{ false }}</k-checkbox>
        <k-checkbox :value="4"> {{ 4 }}</k-checkbox>
      </k-checkbox-group>
    </k-row>
    <k-row>
      <span>Disabled Radio Group: </span>
      <k-checkbox-group v-model="data.v2" disabled>
        <k-checkbox value="ff"> ff </k-checkbox>
        <k-checkbox :value="true"> {{ true }}</k-checkbox>
        <k-checkbox :value="false"> {{ false }}</k-checkbox>
        <k-checkbox :value="4" disabled> {{ 4 }}</k-checkbox>
      </k-checkbox-group>
    </k-row>
  </test-box>
</template>
