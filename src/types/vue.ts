import type { EmptyObject } from 'type-fest'

export type VueComponent<
  Props = EmptyObject,
  Emit = EmptyObject,
  Slots = EmptyObject,
  Exposed = EmptyObject,
> = new () => {
  $props: Props
  $emit: Emit
  $slots: Slots
} & Exposed
