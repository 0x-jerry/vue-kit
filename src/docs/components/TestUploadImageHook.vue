<script lang="ts" setup>
import { KUploadImageContextKey } from '@/components/upload-image/context'

const uploadImageCtx = inject(KUploadImageContextKey)

const names = ref<string[]>([])
function hook(files: File[]) {
  names.value = files.map((n) => n.name)
}

onMounted(() => {
  uploadImageCtx?.hooks.afterSelectImage.add(hook)
})

onUnmounted(() => {
  uploadImageCtx?.hooks.afterSelectImage.delete(hook)
})
</script>

<template>
  <div>
    <div v-for="o in names">
      {{ o }}
    </div>
  </div>
</template>
