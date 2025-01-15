<script setup lang="ts">
import type { ICommonFormFieldConfig, IFieldRuleError } from './types';

export interface FieldItemProps {
  item: ICommonFormFieldConfig
  fieldError?: IFieldRuleError
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
      <div class="v-form-field-error" v-show="fieldError">
        {{ fieldError?.errors.at(0) }}
      </div>
    </div>
  </div>
</template>