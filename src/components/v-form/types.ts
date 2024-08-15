import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { Component } from 'vue'

export interface VFormProps<LayoutConfig = VLayoutProps> {
  layout?: LayoutConfig
  fileds: VFormFieldProps[]
}

export interface VFormFieldProps {
  field: Arrayable<string | number>
  /**
   * If this is a string, then use it as a slot, else use it as a component
   */
  render?: string | Component
}
