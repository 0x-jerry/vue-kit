import { computed, ref, toValue, type ComputedRef, type Ref } from 'vue'
import type { IColumnConfig, ITableOptions } from '../types'
import type { ITableActions, ITablePagination } from './types'

export interface ITableInternalContext<T = unknown> extends ITableActions<T> {
  dataSource: Ref<T[]>
  pagination: Ref<ITablePagination | false>
  columns: ComputedRef<IColumnConfig<T>[]>
}

export function createTable<T>(option: ITableOptions<T>): ITableInternalContext<T> {
  const actions: ITableActions = {
    updateDataSource,
  }

  const ctx: ITableInternalContext<T> = {
    dataSource: ref([]),
    pagination: ref({
      current: 1,
      size: 10,
      total: 0,
    }),
    columns: computed(() => toValue(option.columns)),
    ...actions,
  }

  return ctx

  function updateDataSource(data: T[], total?: number) {
    ctx.dataSource.value = data

    if (total != null && ctx.pagination.value !== false) {
      ctx.pagination.value.total = total
    }
  }
}
