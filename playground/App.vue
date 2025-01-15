<script lang='ts' setup>
import { defineForm } from '../src/components/v-form'

const form = defineForm({
  fields: [
    {
      label: 'Name',
      field: 'name',
      component: 'Input',
      rules: [{
        type: 'string',
        min: 1
      }]
    },
    {
      label: 'Password',
      field: 'password',
      component: 'Input',
    },
  ],
})

async function submit() {
  const data = await form.validate()

  console.log('data', data)
}
</script>

<template>
  <div>App</div>
  <form.Component />
  <button @click="submit">submit</button>
</template>

<style lang='less' scoped></style>