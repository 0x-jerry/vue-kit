import type { Prop, PropType } from 'vue'

export type GetPropsType<T extends {}> = {
  [key in keyof T]: GetPropType<T[key]>
}

export type GetPropType<T> = T extends PropType<infer U>
  ? Optional<U>
  : T extends PropOptions<infer U>
  ? T['required'] extends true
    ? U
    : Optional<U>
  : never

export interface PropOptions<T = any> {
  type?: PropType<T> | true | null
  required?: boolean
}

export type Optional<T> = T | undefined

export const buildProps = <Props extends { [key: string]: Prop<any> }>(props: Props) => props
