<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import { KQrCode } from '@/components/qr-code'

const data = reactive({})
</script>

<template>
  <test-box title="QR Code">
    <k-row>
      <k-qr-code content="1234"></k-qr-code>
    </k-row>
  </test-box>
</template>
