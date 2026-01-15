<script setup lang="ts">
import type { IFromItemProps } from './types'

export interface FieldItemProps extends IFromItemProps {}

defineProps<FieldItemProps>()
</script>

<template>
  <div>
    <label class="v-form-label">
      <span>{{ fieldConfig.label }}</span>
    </label>
    <div class="v-form-field-content">
      <slot></slot>
      <div class="v-form-field-error" v-show="fieldError">
        {{ fieldError?.issues?.at(0) }}
      </div>
    </div>
  </div>
</template>