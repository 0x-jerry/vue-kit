<script lang="ts" setup>
const modules = import.meta.globEager('../docs/*.vue')

const components = Object.entries(modules).filter(([key, o]) => !key.includes('_'))
</script>

<template>
  <div class="test" p="x-6 y-6 b-20">
    <component v-for="o in components" :is="o[1].default"> </component>
  </div>
</template>
