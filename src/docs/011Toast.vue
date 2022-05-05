<script lang="ts" setup>
import { toast, ToastType } from '@/components/toast/context'
import TestBox from './components/TestBox.vue'

const data = reactive({})

function createToast(type: ToastType) {
  toast[type]('hello')
}
</script>

<template>
  <test-box title="Toast">
    <k-row>
      <k-button @click="createToast('info')">info</k-button>
    </k-row>
  </test-box>
</template>
