import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { Component } from 'vue'
import type { IRule } from './rules'

export interface VFormProps<LayoutConfig = VLayoutProps> {
  layout?: LayoutConfig
  fileds: VFormFieldProps[]
}

export interface VFormFieldProps {
  field: Arrayable<string | number>
  /**
   * If this is a string, treat it as a slot, otherwise treat it as a component
   */
  render?: string | Component
  rule?: Arrayable<IRule>
}
