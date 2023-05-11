<script lang="ts" setup>
import { type KImageUploaderUploadContext, KImageUploader } from '@/components'
import TestBox from './components/TestBox.vue'
import TestUploadImageHook from './components/TestUploadImageHook.vue'

const data = reactive({
  image: '',
  images: [],
})

const upload = async (arg: KImageUploaderUploadContext) => {
  return URL.createObjectURL(arg.file)
}
</script>

<template>
  <test-box title="Image Uploader">
    <k-image-uploader v-model="data.image" :upload="upload" class="mb-3">
      <template #hook>
        <test-upload-image-hook></test-upload-image-hook>
      </template>
    </k-image-uploader>

    <k-image-uploader v-model="data.images" :upload="upload" multiple :limit="2" />
  </test-box>
</template>
