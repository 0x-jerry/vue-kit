export interface ITableActions<T = unknown> {
  updateDataSource(data: T[], total?: number): void
}

export interface ITablePagination {
  current: number
  total: number
  size: number
}
