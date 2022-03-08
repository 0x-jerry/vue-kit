import { Component } from 'vue'

export interface ISpotlightContext {}

export interface ISpotlightOption {
  id: string
  title: string
  icon?: string
  /**
   * @see {ISpotlightGroup.id}
   */
  group?: string
  describe?: string
  onclick?: (ctx: ISpotlightContext) => void | Promise<void>
  content?: Component<{ ctx: Component }>
}

export interface ISpotlightGroup {
  id: string
  title: string
  describe?: string
}
