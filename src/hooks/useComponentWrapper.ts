import {
  type Component,
  defineComponent,
  h,
  type MaybeRefOrGetter,
  mergeProps,
  shallowRef,
  toValue,
} from 'vue'
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers'


export interface UseComponentWrapperOptions<T> {
  /**
   * Default props
   */
  props: MaybeRefOrGetter<Partial<ComponentProps<T>>>
}

export function useComponentWrapper<T extends Component>(
  Component: T,
  opt?: UseComponentWrapperOptions<T>,
) {
  const name = (Component as any).name || 'Unknown'

  const instanceRef = shallowRef<ComponentExposed<T>>()

  const WrapperComponent = defineComponent({
    name: `${name}Wrapper`,
    render() {
      const { $attrs, $slots } = this

      const props = mergeProps($attrs, toValue(opt?.props || {}))

      return h(Component, props, $slots)
    },
  })

  return {
    Component: WrapperComponent as T,
    get ins() {
      return instanceRef.value
    },
  }
}
