import type { RenderFunction, VNodeChild } from 'vue'
import type { IFormOptions } from '../v-form'
import type { IData, IToValue } from '../../utils'
import type { Awaitable } from '@0x-jerry/utils'

export type IColumnConfig<
  T extends IData = IData,
  K extends keyof T = keyof T
> = K extends K ? IColumnInnerConfig<T, K, T[K]> : never

export interface IColumnInnerConfig<D, K, V> {
  title: string | RenderFunction
  key?: string
  dataIndex?: K
  render?: IColumnRenderFn<D, K, V>
}

export interface IColumnRenderFn<D, K, V> {
  (props: IColumnRenderContext<D, K, V>): VNodeChild
}

export interface IColumnRenderContext<D, K, V> {
  data: D
  value?: V
  dataIndex?: K
  key?: string
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
  data?: IFetchTableData<T>

  lazy?: boolean

  form?: IFormOptions

  columns: IToValue<IColumnConfig<NoInfer<T>>[]>
  pagination?: IPaginationProps | false

  [key: string]: unknown
}

export interface IFetchTableData<T extends IData> {
  (opt: ITableDataOption): Awaitable<ITableData<T>>
}

export interface IPaginationProps {
  current?: number
  /**
   * @default 10
   */
  size?: number

  [key: string]: unknown
}
