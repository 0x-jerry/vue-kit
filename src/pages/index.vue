<script lang="ts" setup>
import { KUploadImageContext } from '@/components/KUploadImage.types'

const data = reactive({
  image: '',
  images: [],
})

const upload = async (arg: KUploadImageContext) => {
  console.log(arg.file)
  return arg.file.name
}
</script>

<template>
  <div class="test">
    <k-upload-image v-model="data.image" :upload="upload" />

    <k-upload-image v-model="data.images" :upload="upload" multiple :limit="2" />
  </div>
</template>
