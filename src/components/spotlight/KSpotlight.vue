<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useGlobalKeydown } from '@/hooks'
import { ISpotlightOption } from './spotlight'

export interface SpotlightProps {
  visible: boolean
  items: ISpotlightOption[]
}

const props = defineProps<SpotlightProps>()

const emit = defineEmits<{
  (type: 'update:visible', value: boolean): void
  (type: 'click', value: ISpotlightOption): void
}>()

const input = ref<HTMLInputElement>()

const data = reactive({
  input: '',
  placeholder: 'Try type something...',
  selectedIndex: 0,
})

const filteredSpotOptions = computed(() => {
  if (!data.input) return props.items.slice(0, 10)

  return props.items.filter((f) => f.title.includes(data.input))
})

function preventMoveCursor(e: Event) {
  const ev = e as KeyboardEvent

  if (ev.key === 'ArrowUp') {
    select(data.selectedIndex - 1)
    ev.preventDefault()
  }

  if (ev.key === 'ArrowDown' || ev.key === 'Tab') {
    select(data.selectedIndex + 1)
    ev.preventDefault()
  }

  if (ev.key === 'Enter') {
    enterItem()
    ev.preventDefault()
  }
}

function whenShow() {
  data.input = ''
  input.value?.focus()
}

function enterItem(o?: ISpotlightOption) {
  o ||= filteredSpotOptions.value[data.selectedIndex]

  if (!o) return

  emit('click', o)
  close()
}

function select(index = 0) {
  const itemsLength = filteredSpotOptions.value.length

  while (index < 0) {
    index += itemsLength
  }

  data.selectedIndex = index % itemsLength
}

useGlobalKeydown('esc', () => {
  close()
})

useGlobalKeydown('meta + k', () => {
  emit('update:visible', true)
  input.value?.focus()
})

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <transition name="fade" @enter="whenShow">
    <div
      ref="spotlightBox"
      class="fixed w-screen h-screen z-100 top-0 left-0"
      bg="opacity-70 gray-200"
      v-show="visible"
    >
      <div
        class="fixed top-1/4 left-1/2 items-center transform -translate-x-1/2"
        box="border"
        w="700px"
        bg="white"
        overflow="hidden"
        border="~ solid gray-300 rounded-md"
      >
        <div class="items-center" h="50px" bg="gray-50" flex="~" p="x-4">
          <div class="input" w="full">
            <input
              ref="input"
              class="w-full"
              bg="transparent"
              :placeholder="data.placeholder"
              border="none"
              outline="none"
              type="text"
              @focus="data.placeholder = 'Try type something...'"
              @blur="data.placeholder = 'Press ⌘ + K to focus'"
              v-model="data.input"
              @keydown="preventMoveCursor"
            />
          </div>
        </div>

        <div class="spotlight-content" overflow="auto" h="max-300px" border="none t solid gray-100">
          <button
            class="spotlight-item items-center"
            v-for="(o, idx) in filteredSpotOptions"
            :class="{ 'is-focus': data.selectedIndex === idx }"
            :key="o.id"
            h="50px"
            flex="~"
            p="x-4"
            bg="white"
            @click="enterItem(o)"
          >
            {{ o.title }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spotlight-item {
  width: 100%;

  @apply outline-none border-none;

  &.is-focus {
    @apply bg-gray-50;
  }
}

.spotlight-item + .spotlight-item {
  @apply border-t border-gray-100;
}
</style>
