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
        min: 2
      }]
    },
    {
      label: 'Select',
      field: 'select',
      component: 'Select',
      componentProps: {
        items: Array(10).fill(0).map((_, idx) => ({ value: idx, label: `label-${idx + 1}` })),
        itemTitle: 'label',
        itemValue: 'value'
      }
    },
    {
      label: 'Check',
      field: 'check',
      component: 'Checkbox',
      componentProps: {
      }
    },
  ],
})

async function submit(data: unknown) {
  await sleep(1000)

  console.log('data', data)
}
</script>

<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar title="App bar"></v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <v-card title="Login" class="w-400px mt-4 mx-auto">
            <v-card-text>
              <form.Component />
            </v-card-text>

            <v-card-actions class="justify-end">
              <form.Submit @submit="submit" text="Login" class="text-none" />
            </v-card-actions>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style lang='less' scoped></style>