<script lang="ts" setup>
import { KImageUploaderContextKey } from '@/components'

const uploadImageCtx = inject(KImageUploaderContextKey)

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
