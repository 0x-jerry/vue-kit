<script setup lang="ts">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { IFormFieldConfig } from './types'

export interface FieldItemProps {
  item: IFormFieldConfig
  fieldError?: StandardSchemaV1.Issue[]
}

defineProps<FieldItemProps>()
</script>

<template>
  <div>
    <label class="v-form-label">
      <span>{{ item.label }}</span>
    </label>
    <div class="v-form-field-content">
      <slot></slot>
      <div class="v-form-field-error" v-show="fieldError?.length">
        {{ fieldError?.at(0)?.message }}
      </div>
    </div>
  </div>
</template>