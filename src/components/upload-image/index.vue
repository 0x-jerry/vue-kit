<script lang="ts" setup>
import { KUploadImageContext } from './types'
import { toArray } from '@0x-jerry/utils'
import IconPlus from '~icons/carbon/add'
import IconDelete from '~icons/carbon/delete'
import IconEdit from '~icons/carbon/edit'
import { chooseFiles } from '../utils'

const props = withDefaults(
  defineProps<{
    modelValue: string | string[]
    accept?: string
    multiple?: boolean
    size?: string | { width: string; height: string }
    limit?: number
    upload: (ctx: KUploadImageContext) => Promise<string>
  }>(),
  {
    multiple: false,
    accept: '.jpg,.jpeg,.png',
    size: '100px',
  },
)

interface ImageRenderData {
  url: string
  blob?: string
  error?: string
}

const images = computed(() => {
  return toArray(props.modelValue)
    .filter((n) => !!n)
    .map((url) => {
      const ctx: ImageRenderData = {
        url,
      }

      return ctx
    })
})

const isSingleMode = computed(() => !Array.isArray(props.modelValue))

const imageStyle = computed(() => {
  if (typeof props.size === 'string') {
    return {
      width: props.size,
      height: props.size,
    }
  } else {
    return props.size
  }
})

const showUploadButton = computed(() => {
  const imgLen = images.value.length
  if (Array.isArray(props.modelValue)) {
    return props.limit ? imgLen < props.limit : true
  }

  return imgLen < 1
})

const emit = defineEmits<{
  (type: 'update:modelValue', val: string | string[]): void
}>()

function emitModelValue(urls: string[]) {
  if (isSingleMode.value) {
    emit('update:modelValue', urls[0] || '')
  } else {
    emit('update:modelValue', urls)
  }
}

async function uploadImage() {
  const files = await chooseFiles(props)
  if (!files.length) return

  const restCount = Array.isArray(props.modelValue)
    ? props.limit
      ? props.limit - images.value.length
      : Infinity
    : 1 - images.value.length

  const uploadFiles = files.slice(0, restCount)

  const p = uploadFiles.map(async (file) => {
    try {
      const ctx = await uploadImageFile(file)
      return ctx.url
    } catch (error) {
      //
    }
  })

  const urls = (await Promise.all(p)).filter(Boolean) as string[]

  emitModelValue([...images.value.map((n) => n.url), ...urls])
}

async function uploadImageFile(file: File) {
  const ctx: KUploadImageContext = {
    file,
  }

  const url = await props.upload(ctx)

  return {
    ...ctx,
    url,
  }
}

async function reUploadImage(idx: number) {
  const files = await chooseFiles({ ...props, multiple: false })
  if (!files) return

  const file = files[0]

  const ctx = await uploadImageFile(file)

  const urls = images.value.map((n) => n.url)
  urls.splice(idx, 1, ctx.url)

  emitModelValue(urls)
}

async function deleteImage(idx: number) {
  const urls = images.value.map((n) => n.url)
  urls.splice(idx, 1)

  emitModelValue(urls)
}
</script>

<template>
  <div class="k-upload-image" flex="~ wrap" grid="gap-2">
    <template v-for="(ctx, idx) in images" :key="`${idx}:${ctx.url}`">
      <slot
        name="image"
        :url="ctx.url"
        :index="idx"
        :re-upload="() => reUploadImage(idx)"
        :delete="() => deleteImage(idx)"
      >
        <span class="relative" :style="imageStyle" border="~ solid gray-200">
          <img
            class="block"
            w="full"
            h="full"
            object="contain"
            :src="ctx.url"
            :title="ctx.url"
            text="gray-300"
          />
          <div
            class="absolute top-0 left-0"
            z="10"
            bg="gray-700 opacity-50"
            opacity="0 hover:100"
            transition="~ colors"
            w="full"
            h="full"
            flex="~"
            justify="center"
            align="items-center"
          >
            <div flex="~" grid="gap-x-2">
              <icon-edit
                class="text-light-900 hover:text-white cursor-pointer transition transition-colors"
                @click="reUploadImage(idx)"
              />
              <icon-delete
                @click="deleteImage(idx)"
                class="text-light-900 hover:text-white cursor-pointer transition transition-colors"
              />
            </div>
          </div>
        </span>
      </slot>
    </template>
    <button
      :style="imageStyle"
      border="~ solid current rounded-sm"
      transition="~ colors"
      @click="uploadImage"
      v-if="showUploadButton"
      flex="~"
      justify="center"
      align="items-center"
      text="gray-300 hover:blue-500 2xl"
    >
      <icon-plus />
    </button>
  </div>
</template>
