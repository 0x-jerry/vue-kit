import type { ComputedRef, MaybeRefOrGetter, SetupContext, ShallowRef } from 'vue'

export type IToValue<T> = MaybeRefOrGetter<T> | ComputedRef<T> | ShallowRef<T>

export type FunctionalSetupContext = Omit<SetupContext, 'expose'>

export interface IData {
  // biome-ignore lint/suspicious/noExplicitAny: utils type
  [key: string]: any
}
