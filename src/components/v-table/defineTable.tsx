import { mergeProps, type FunctionalComponent } from 'vue'
import type { ITableActions } from './hooks/types'
import type { ITableDataOption, ITableOptions } from './types'
import { createTable } from './hooks/createTable'
import { configs } from './configs'
import { type FunctionalSetupContext } from '../../utils'
import { defineForm, type IFormContext } from '../v-form'

export interface ITableContext<T> extends ITableActions<T> {
  Component: FunctionalComponent
  Table: FunctionalComponent
  Form: FunctionalComponent
  Pagination: FunctionalComponent

  form?: IFormContext

  // extra actions
  reload(): void
}

export function defineTable<T>(config: ITableOptions<T>) {
  const tableContext = createTable(config)

  const exposeTableContext = tableContext as unknown as ITableContext<T>

  const formCtx = config.form ? defineForm(config.form) : null

  Object.assign(exposeTableContext, {
    form: formCtx,
    Component: createWrapperComponent,
    Form: createFormComponent,
    Table: createTableComponent,
    Pagination: createPaginationComponent,

    reload: fetchData
  })

  _initlize()

  return exposeTableContext

  async function _initlize() {
    if (!config.lazy) {
      await fetchData()
    }
  }

  async function fetchData() {
    const params: ITableDataOption = {}

    const { pagination, dataSource } = tableContext

    const paginator = pagination.value

    if (paginator) {
      params.current = paginator.current
      params.size = paginator.size
    }

    if (formCtx) {
      const query = formCtx.getData()
      params.query = query
    }

    const resp = await config.data(params)
    dataSource.value = resp.data

    if (paginator) {
      paginator.total = resp.total
    }
  }

  function createWrapperComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    const Table = createTableComponent()
    const Form = createFormComponent()

    const Pagination = createPaginationComponent()

    return (
      <div class="v-table" v-bind={ctx?.attrs || {}}>
        {Form}
        {Table}
        {Pagination}
      </div>
    )
  }

  function createTableComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    const { Table, Column } = configs.Components
    const columns = tableContext.columns.value

    const renderedColumns = columns.map((column) => {
      return <Column key={column.dataIndex} v-slots={{ default: column.render }} />
    })

    return <Table v-bind={ctx?.attrs || {}}>{renderedColumns}</Table>
  }

  function createPaginationComponent(
    _props?: Record<string, unknown>,
    ctx?: FunctionalSetupContext,
  ) {
    const { Pagination } = configs.Components
    const configProps = config.pagination

    if (configProps === false) {
      return
    }

    const props = mergeProps(configProps || {}, ctx?.attrs || {})

    return <Pagination v-bind={props} />
  }

  function createFormComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    if (!formCtx) {
      return
    }

    return <formCtx.Component v-bind={ctx?.attrs || {}} />
  }
}
