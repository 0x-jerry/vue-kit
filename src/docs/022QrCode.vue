<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import { KQrCode } from '@/components/qr-code'
import { KInput } from '@/components'

const data = reactive({
  v: '1234',
})
</script>

<template>
  <test-box title="QR Code">
    <k-col>
      <KInput v-model="data.v"></KInput>
      <div>
        <k-qr-code :content="data.v"></k-qr-code>
      </div>
    </k-col>
  </test-box>
</template>
