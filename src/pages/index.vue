<script lang="ts" setup>
const modules = import.meta.globEager('../docs/*.vue')

const components = Object.entries(modules).filter(([key, o]) => !key.includes('_'))
</script>

<template>
  <div class="test">
    <component v-for="o in components" :is="o[1].default"> </component>
  </div>
</template>
