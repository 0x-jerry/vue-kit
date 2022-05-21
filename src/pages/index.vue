<script lang="ts" setup>
const modules = import.meta.globEager('../docs/*.vue')

const components = Object.entries(modules).filter(([key, o]) => !key.includes('_'))
</script>

<template>
  <div class="docs-page" p="y-6 b-20" m="auto">
    <component v-for="o in components" :is="o[1].default"> </component>
  </div>
</template>

<style lang="less" scoped>
.docs-page {
  max-width: 800px;
}
</style>
