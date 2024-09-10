import type { MaybeRefOrGetter, ComputedRef, ShallowRef, SetupContext } from 'vue'

export type IToValue<T> = MaybeRefOrGetter<T> | ComputedRef<T> | ShallowRef<T>

export type FunctionalSetupContext = Omit<SetupContext, 'expose'>

export type IData = Record<string, any>