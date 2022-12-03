<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import { uuid } from '@0x-jerry/utils'
import { KButton, toast, ISpotlightOption, KSpotlight } from '@/components'

const data = reactive({
  visible: false,
  items: [
    {
      id: uuid(),
      title: '测试',
      describe: '测试说明',
    },
    {
      id: uuid(),
      title: '测试2',
      describe: '测试说明',
    },
  ],
})

function onClick(item: ISpotlightOption) {
  toast.success('select:' + item.title)
}
</script>

<template>
  <test-box title="Spotlight">
    <KSpotlight :items="data.items" v-model:visible="data.visible" @click="onClick"> </KSpotlight>
    <div class="bg-gray-1 p-4 flex items-center gap-2">
      <span> Press meta + K to invoke spotlight toolbar, or click </span>
      <KButton @click="data.visible = true"> Invoke Spotlight </KButton>
    </div>
  </test-box>
</template>
