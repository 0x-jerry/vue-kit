<script lang="ts" setup>
import TestBox from './components/TestBox.vue'

const data = reactive({
  left: false,
  right: false,
})
</script>

<template>
  <test-box title="Drawer">
    <k-row>
      <k-button @click="data.left = true">open left drawer </k-button>
      <k-button @click="data.right = true">open right drawer </k-button>
    </k-row>

    <k-drawer v-model="data.left" placement="left" title="Drawer left title">
      <div h="120vh" border="~ solid gray-300"></div>
    </k-drawer>

    <k-drawer v-model="data.right">
      <template #head>
        <div>Drawer right</div>
      </template>
      <div h="120vh" border="~ solid gray-300"></div>
      <template #footer>
        <div>Drawer right footer</div>
      </template>
    </k-drawer>
  </test-box>
</template>
