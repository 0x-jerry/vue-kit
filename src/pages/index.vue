<script lang="ts" setup>
import { KUploadImageUploadContext, KUploadImage } from '@/components'
import TestUploadImageHook from './components/TestUploadImageHook.vue'

const data = reactive({
  image: '',
  images: [],
})

const upload = async (arg: KUploadImageUploadContext) => {
  return URL.createObjectURL(arg.file)
}
</script>

<template>
  <div class="test">
    <k-upload-image v-model="data.image" :upload="upload">
      <template #hook>
        <test-upload-image-hook></test-upload-image-hook>
      </template>
    </k-upload-image>

    <k-upload-image v-model="data.images" :upload="upload" multiple :limit="2" />
  </div>
</template>
