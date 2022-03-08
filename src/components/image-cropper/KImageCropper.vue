<script lang="ts" setup>
import { createPromiseInstance } from '@0x-jerry/utils'
import CropperJS from 'cropperjs'
import { KImageUploaderContextKey } from '../image-uploader'

const props = defineProps<{
  url?: string
}>()
const emit = defineEmits<{
  (type: 'cropped', url: string): void
}>()

const ctx = inject(KImageUploaderContextKey)
if (ctx) {
  ctx.hooks.afterSelectImage.add(cropImage)
}

const data = reactive({
  url: '',
})

const source = computed(() => props.url || data.url)

let cropper: Cropper

function cropImage(files: File[]) {
  const p = createPromiseInstance()
  const [file] = files

  if (!file) {
    return
  }

  data.url = URL.createObjectURL(file)

  return p
}

const imageEl = ref<HTMLImageElement>()
const previewImageEl = ref<HTMLDivElement>()
watch(
  () => [props.url, data.url, imageEl.value],
  () => {
    if (!imageEl.value) return

    initCropper(imageEl.value)
  },
  {
    immediate: true,
  },
)

function initCropper(el: HTMLImageElement) {
  if (!previewImageEl.value) return

  var options: Cropper.Options = {
    checkCrossOrigin: false,
    aspectRatio: 16 / 9,
    preview: previewImageEl.value,
    ready: function (e) {
      console.log(e.type)
    },
    cropstart: function (e) {
      console.log(e.type, e.detail.action)
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action)
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action)
    },
    crop: function (e) {
      console.log(e.type)
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio)
    },
  }

  cropper = new CropperJS(el, options)
}

function confirmCrop() {
  const url = cropper.getCroppedCanvas().toDataURL('image/jpeg')
  emit('cropped', url)
}
</script>

<template>
  <div>
    <div>
      <img ref="imageEl" :src="source" />
    </div>

    <button @click="confirmCrop">crop</button>
    <div ref="previewImageEl" w="200px" h="100px" overflow="hidden"></div>
  </div>
</template>

<style></style>
