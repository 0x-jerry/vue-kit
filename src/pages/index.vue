<script lang="ts" setup>
import { Component } from 'vue'

const modules = import.meta.glob<{ default: Component }>('../docs/*.vue', { eager: true })

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
