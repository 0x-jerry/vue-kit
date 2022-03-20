import type { Component } from 'vue'

export interface KMenuButton {
  icon?: Component
  content: string
  disabled?: boolean
  onclick?: () => any
}

export type KMenuDivide = 'divide'

export type KMenuItem = KMenuButton | KMenuDivide
