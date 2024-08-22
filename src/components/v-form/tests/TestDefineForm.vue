<script lang="ts" setup>
import { defineForm } from "../defineForm";

const form = defineForm({
  layout: {
    type: "flex-col",
  },
  fields: [
    {
      label: "F 1",
      field: "key1",
      compoennt: "Input",
      componentProps: {
        max: 10,
      },
    },
  ],
});
</script>

<template>
  <form.Component></form.Component>
</template>
