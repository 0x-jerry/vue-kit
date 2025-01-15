<script lang='ts' setup>
import { defineAForm } from './form';
import { sleep } from '@0x-jerry/utils';

const form = defineAForm({
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

async function submit(data: unknown) {
  await sleep(1000)

  console.log('data', data)
}
</script>

<template>
  <div>App</div>
  <div class="w-400px mx-auto">
    <div class="title mb-4">
      Login
    </div>

    <form.Component />

    <div class="flex justify-end mt-3">
      <form.Submit :onSubmit="submit" />
    </div>
  </div>
</template>

<style lang='less' scoped></style>