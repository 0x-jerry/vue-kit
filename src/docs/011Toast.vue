<script lang="ts" setup>
import { toast, type ToastType } from '@/components/toast/context'
import TestBox from './components/TestBox.vue'

const data = reactive({
  position: 'right' as 'left' | 'right',
})

function createToast(type: ToastType) {
  toast[type]('hello')
}
</script>

<template>
  <test-box title="Toast">
    <k-row>
      <k-radio v-model="data.position" value="left">left</k-radio>
      <k-radio v-model="data.position" value="right">right</k-radio>
    </k-row>
    <k-row>
      <k-button @click="createToast('warning')">warning</k-button>
      <k-button @click="createToast('success')">success</k-button>
      <k-button @click="createToast('info')">info</k-button>
      <k-button @click="createToast('error')">error</k-button>
    </k-row>
  </test-box>
  <k-toast :position="data.position"></k-toast>
</template>
