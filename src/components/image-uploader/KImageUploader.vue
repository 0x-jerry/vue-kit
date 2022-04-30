<script lang="ts" setup>
import { KImageUploaderUploadContext } from './types'
import { Arrayable, toArray } from '@0x-jerry/utils'
import IconPlus from '~icons/carbon/add'
import IconDelete from '~icons/carbon/delete'
import IconEdit from '~icons/carbon/edit'
import { chooseFiles } from './utils'
import { createUploadImageContext, KImageUploaderContextKey } from './context'

const props = withDefaults(
  defineProps<{
    modelValue: Arrayable<string>
    accept?: string
    multiple?: boolean
    size?: string | { width: string; height: string }
    limit?: number
    upload: (ctx: KImageUploaderUploadContext) => Promise<string>
  }>(),
  {
    multiple: false,
    accept: '.jpg,.jpeg,.png',
    size: '100px',
  },
)

const ctx = createUploadImageContext()

provide(KImageUploaderContextKey, ctx)

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

  await resolveUploadImages(files)
}

async function resolveUploadImages(files: File[]) {
  await ctx.hooks.afterSelectImage.applyHooks(files)

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
  const ctx: KImageUploaderUploadContext = {
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

async function onDrop(evt: DragEvent) {
  evt.preventDefault()
  evt.stopPropagation()
  const files = evt.dataTransfer?.files

  if (files) {
    await resolveUploadImages([...files])
  }
}
</script>

<template>
  <div class="k-upload-image">
    <template v-for="(ctx, idx) in images" :key="`${idx}:${ctx.url}`">
      <slot
        name="image"
        :url="ctx.url"
        :index="idx"
        :re-upload="() => reUploadImage(idx)"
        :delete="() => deleteImage(idx)"
      >
        <span class="k-upload-image--image__box" :style="imageStyle">
          <img class="k-upload-image--image block" :src="ctx.url" :title="ctx.url" />
          <div class="k-upload-image--actions">
            <div flex="~" grid="gap-x-2">
              <icon-edit class="k-upload-image--actions__icon" @click="reUploadImage(idx)" />
              <icon-delete class="k-upload-image--actions__icon" @click="deleteImage(idx)" />
            </div>
          </div>
        </span>
      </slot>
    </template>
    <button
      :style="imageStyle"
      class="k-upload-image--button"
      @click="uploadImage"
      v-if="showUploadButton"
      @drop="onDrop"
    >
      <icon-plus />
    </button>
    <slot name="hook"></slot>
  </div>
</template>

<style lang="less">
.k-upload-image {
  @apply flex flex-wrap gap-2;

  &--image__box {
    @apply relative border border-solid border-gray-200;
  }

  &--image {
    @apply block w-full h-full object-contain text-gray-300;
  }

  &--actions {
    @apply absolute top-0 left-0;
    @apply z-1;
    @apply bg-gray-700 bg-opacity-50;
    @apply opacity-0 hover:opacity-100;
    @apply transition transition-colors;
    @apply w-full h-full;
    @apply flex justify-center items-center;

    &__icon {
      @apply text-light-900 hover:text-white cursor-pointer transition transition-colors;
    }
  }

  &--button {
    @apply border border-solid border-current rounded-sm hover:border-blue-500;
    @apply transition transition-colors;
    @apply outline-none;
    @apply flex justify-center items-center;
    @apply text-gray-300 hover:text-blue-500 text-2xl;
  }
}
</style>
