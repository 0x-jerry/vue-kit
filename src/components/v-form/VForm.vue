<script setup lang="ts">
async function onSubmit() {
  // 
}
</script>

<template>
  <form class="v-form" @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>