<script lang="ts" setup>
import TestBox from './components/TestBox.vue'
import KSpotlight from '@/components/spotlight/KSpotlight.vue'
import { uuid } from '@0x-jerry/utils'
import { ISpotlightOption } from '@/components/spotlight'
import { toast } from '@/components'

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
    <div class="bg-gray-1 p-4">Press meta + K to invoke spotlight toolbar</div>
  </test-box>
</template>
