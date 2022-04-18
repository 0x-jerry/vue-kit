<script lang="ts" setup>
import qrcode from 'qrcode'

const props = defineProps<{
  content: string
}>()

const el = ref<HTMLCanvasElement>()

watch(
  () => [props.content, el.value],
  () => {
    if (!el.value) return

    const content = props.content

    qrcode.toCanvas(el.value, content, {
      margin: 0,
    })
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="k-qr-code">
    <canvas ref="el"></canvas>
  </div>
</template>

<style lang="less">
.k-qr-code {
  @apply inline-block;
  @apply p-4;
  @apply border border-solid border-gray-100;
}
</style>
