<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useGlobalKeydown } from '@/hooks'
import { ISpotlightGroup, ISpotlightOption } from './spotlight'
import { createDomNavigator, KeyboardNavigator, sleep } from '@0x-jerry/utils'

interface SpotlightProps {
  visible: boolean
  items: ISpotlightOption[]
  groups: ISpotlightGroup[]
}

const input = ref<HTMLInputElement>()

const spotlightBox = ref<HTMLDivElement>()

let keyboardNav: KeyboardNavigator | null = null

onMounted(() => {
  if (spotlightBox.value) {
    keyboardNav = createDomNavigator(spotlightBox.value, {
      onfocus(e) {
        const pre = document.activeElement as HTMLElement | null

        e.classList.add('focus')

        e.focus()

        if (pre?.getAttribute('tabindex') !== '-1') {
          pre?.focus()
        }
      },
      onblur(e) {
        e.classList.remove('focus')
      },
      onenter(e) {
        e.click()
      },
    })
  }
})

function preventMoveCursor(e: Event) {
  const ev = e as KeyboardEvent

  if (['ArrowUp', 'ArrowDown'].includes(ev.key)) {
    ev.preventDefault()
  }

  if (ev.key === 'Tab' || ev.key === 'Enter') {
    ev.preventDefault()
    ev.stopImmediatePropagation()
    const id = keyboardNav?.activeElement?.id.replace('spotlight-item-', '')
    const activeItem = props.items.find((i) => i.id === id)

    if (activeItem) {
      data.input = activeItem.title
    }
  }
}

function focusCurrent(e: Event) {
  if (!keyboardNav) return

  keyboardNav.activeElement = e.target as HTMLElement
}

const emit = defineEmits(['update:visible'])

const props = defineProps<SpotlightProps>()

const data = reactive({
  input: '',
  placeholder: 'Try type something...',
})

watch(
  () => data.input,
  async () => {
    if (keyboardNav?.activeElement) {
      return
    }

    keyboardNav?.blur()
    await sleep(0)
    keyboardNav?.focus()
  },
)

const result = computed(() => {
  if (!data.input) return []

  return props.items.filter((f) => f.title.includes(data.input))
})

watchEffect(() => {
  if (props.visible) {
    data.input = ''
  }
})

function whenShow() {
  data.input = ''
  input.value?.focus()
}

function enterItem(o: ISpotlightOption) {
  alert(o.title)
}

useGlobalKeydown('esc', () => {
  // if (input.value === document.activeElement) {
  //   input.value.blur()
  //   return
  // }

  emit('update:visible', false)
})

useGlobalKeydown('meta,k', () => {
  emit('update:visible', true)
  input.value?.focus()
})
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
        class="absolute top-1/4 left-1/2 items-center"
        transform="~ -translate-x-1/2"
        box="border"
        w="700px"
        bg="white"
        overflow="hidden"
        border="~ solid gray-300 rounded-md"
      >
        <div class="items-center" h="50px" bg="gray-50" flex="~" p="x-4">
          <!-- <div
            class="tag"
            text="sm blue-500"
            w="50px"
            h="20px"
            border="~ solid blue-300 rounded-full"
            m="r-2"
          >
            small
          </div> -->
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
        <div class="spotlight-content" overflow="auto" h="max-300px" border="t solid gray-100">
          <div
            class="spotlight-item items-center"
            v-for="o in result"
            :key="o.id"
            :id="`spotlight-item-${o.id}`"
            h="50px"
            flex="~"
            p="x-4"
            bg="white"
            tabindex="-1"
            @click="enterItem(o)"
            @mousemove="focusCurrent"
          >
            {{ o.title }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spotlight-item + .spotlight-item {
  @apply border-t border-gray-100;
}

.spotlight-item.focus {
  @apply bg-gray-50;
}

.spotlight-item:focus {
  outline: none;
}
</style>
