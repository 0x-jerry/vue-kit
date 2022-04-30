<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  v1: 1,
  v2: 2,
})

const values = [1, 2, 3]
</script>

<template>
  <test-box title="Radio">
    <k-row>
      <span>Radio: </span>
      <k-radio v-for="v in values" v-model="data.v1" :value="v"> {{ v }}</k-radio>
      <k-radio v-model="data.v1" :value="4" disabled> {{ 4 }}</k-radio>
    </k-row>
    <k-row>
      <span>Radio Group: </span>
      <k-radio-group v-model="data.v2">
        <k-radio v-for="v in values" :value="v"> {{ v }}</k-radio>
        <k-radio :value="4" disabled> {{ 4 }}</k-radio>
      </k-radio-group>
    </k-row>
    <k-row>
      <span>Disabled Radio Group: </span>
      <k-radio-group v-model="data.v2" disabled>
        <k-radio v-for="v in values" :value="v"> {{ v }}</k-radio>
        <k-radio :value="4" disabled> {{ 4 }}</k-radio>
      </k-radio-group>
    </k-row>
  </test-box>
</template>
