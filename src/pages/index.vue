<script lang="ts" setup>
import { KUploadImageContext, KUploadImage } from '@/components'

const data = reactive({
  image: '',
  images: [],
})

const upload = async (arg: KUploadImageContext) => {
  return URL.createObjectURL(arg.file)
}
</script>

<template>
  <div class="test">
    <k-upload-image v-model="data.image" :upload="upload" />

    <k-upload-image v-model="data.images" :upload="upload" multiple :limit="2" />
  </div>
</template>
