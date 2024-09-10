import type { RenderFunction, VNodeChild } from 'vue'
import type { IFormOptions } from '../v-form'
import type { IData, IToValue } from '../../utils'
import type { Awaitable } from '@0x-jerry/utils'

export type IColumnConfig<
  T extends IData = IData,
  K extends keyof T = keyof T
> = K extends K ? IColumnInnerConfig<K, T[K]> : never

export interface IColumnInnerConfig<K, V> {
  dataIndex: K
  title: string | RenderFunction
  render?: IColumnRenderFn<K, V>
}

export interface IColumnRenderFn<K, V> {
  (props: IColumnRenderContext<K, V>): VNodeChild
}

export interface IColumnRenderContext<K, V> {
  data: V
  dataIndex: K
  index: number
}

export interface ITableData<T = unknown> {
  data: T[]
  total?: number
}

export interface ITableDataOption {
  current?: number
  size?: number
  query?: IData
}

export interface ITableOptions<T extends IData = IData> {
  data: (opt: ITableDataOption) => Awaitable<ITableData<T>>

  lazy?: boolean

  form?: IFormOptions

  columns: IToValue<IColumnConfig<NoInfer<T>>[]>
  pagination?: IPaginationProps | false

  [key: string]: unknown
}

export interface IPaginationProps {
  current?: number
  /**
   * @default 10
   */
  size?: number

  [key: string]: unknown
}
