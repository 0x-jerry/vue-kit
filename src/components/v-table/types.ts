import type { RenderFunction, VNodeChild } from 'vue'
import type { IFormOptions } from '../v-form'
import type { IToValue } from '../../utils'

export interface IColumnConfig<T = unknown> {
  dataIndex: string
  header: string | RenderFunction
  render?: (props: IColumnRenderContext<T>) => VNodeChild

  [key: string]: unknown
}

export interface IColumnRenderContext<T = unknown> {
  data: T
  dataIndex: string
  index: number
}

export interface ITableData<T = unknown> {
  data: T[]
  total: number
}

export interface ITableDataOption {
  current?: number
  size?: number
  query?: Record<string, unknown>
}

export interface ITableOptions<T = unknown> {
  data: (opt: ITableDataOption) => ITableData<T>

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
