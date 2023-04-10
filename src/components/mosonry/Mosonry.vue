<script lang='ts' setup>
import { nextTick, onMounted, onUnmounted, reactive, watch } from 'vue';

const props = defineProps<{
  data: any[]
  column: number
}>()

const columns = reactive(Array(props.column) as any[][])

const containers = reactive([] as HTMLElement[])

const keyCache = new Map()

let filled = 0

onMounted(() => startCalcFill())

watch(() => props.column, () => startCalcFill())

watch(() => props.data.length, () => startCalcFill())

async function startCalcFill() {
  filled = 0
  columns.splice(0)
  containers.splice(props.column)

  keyCache.clear()

  props.data.forEach(item => {
    keyCache.set(item.key, item)
  })

  await nextTick()
  await calcFill()
}

onUnmounted(() => {
  filled = 0
  columns.splice(0)
  containers.splice(0)
})

async function calcFill() {
  if (filled >= props.data.length) return

  const idx = getShortColumnIdx()

  if (idx === false) {
    return
  }

  const key = props.data[filled].key

  columns[idx] ||= []
  columns[idx].push(key)

  filled++
  await nextTick()
  await calcFill()
}

function getShortColumnIdx() {
  let min = Infinity
  let minIdx = 0


  for (let idx = 0; idx < props.column; idx++) {
    const item = containers[idx];
    if (!item) return false

    if (item.clientHeight < min) {
      min = item.clientHeight
      minIdx = idx
    }
  }

  return minIdx
}

</script>

<template>
  <div class="flow">
    <div class="flow-column" v-for="idx in column">
      <div :ref="(e: any) => containers[idx - 1] = e">
        <template v-for="itemKey in columns[idx - 1]" :key="itemKey">
          <slot :item="keyCache.get(itemKey)"></slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.flow {
  display: flex;
  gap: 6px;

  &-column {
    flex: 1;
  }
}
</style>