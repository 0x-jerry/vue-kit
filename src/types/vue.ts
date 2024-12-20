export type VueComponent<Props, Emit, Slots, Exposed> = new () => {
  $props: Props
  $emit: Emit
  $slots: Slots
} & Exposed
