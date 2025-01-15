import { mergeProps, type FunctionalComponent } from 'vue'
import type { ITableActions } from './hooks/types'
import type { IFetchDataParams, ITableOptions } from './types'
import { createTableContext } from './hooks/createTableContext'
import { configs } from './configs'
import type { FunctionalSetupContext, IData } from '../../utils'
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

export function defineTable<T extends IData>(config: ITableOptions<T>) {
  const tableContext = createTableContext(config)

  const exposeTableContext = tableContext as unknown as ITableContext<T>

  const formCtx = config.form ? defineForm(config.form) : null

  Object.assign(exposeTableContext, {
    form: formCtx,
    Component: createWrapperComponent,
    Form: createFormComponent,
    Table: createTableComponent,
    Pagination: createPaginationComponent,

    reload: fetchData,
  })

  _initlize()

  return exposeTableContext

  async function _initlize() {
    if (!config.lazy) {
      await fetchData()
    }
  }

  async function fetchData() {
    if (!config.data) return

    const params: IFetchDataParams = {}

    const { pagination, dataSource } = tableContext

    const paginationData = pagination.value

    if (paginationData) {
      params.current = paginationData.current
      params.size = paginationData.size
    }

    if (formCtx) {
      const query = formCtx.getData()
      params.query = query
    }

    const resp = await config.data(params)
    dataSource.value = resp.data

    if (paginationData) {
      paginationData.total = resp.total ?? resp.data.length
    }
  }

  function createWrapperComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    const Table = createTableComponent()
    const Form = createFormComponent()

    const Pagination = createPaginationComponent()

    return (
      <div class="v-table-warpper" {...(ctx?.attrs || {})}>
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
      return (
        <Column
          key={column.dataIndex}
          v-slots={{
            title: column.title,
            default: column.render,
          }}
        />
      )
    })

    const props = mergeProps(ctx?.attrs || {}, {
      dataSource: tableContext.dataSource.value,
    })

    return <Table {...(props || {})}>{renderedColumns}</Table>
  }

  function createPaginationComponent(
    _props?: Record<string, unknown>,
    ctx?: FunctionalSetupContext,
  ) {
    const { Pagination } = configs.Components
    const paginationData = tableContext.pagination.value

    if (paginationData === false) {
      return
    }

    const props = mergeProps(
      paginationData as unknown as Record<string, unknown>,
      ctx?.attrs || {},
      {
        'onUpdate:current'(value: number) {
          paginationData.current = value
          fetchData()
        },
        'onUpdate:size'(value: number) {
          paginationData.size = value

          {
            // check pagination current value by total
            const maxCurrent = Math.ceil(paginationData.total / paginationData.size)

            if (maxCurrent > 0 && paginationData.current > maxCurrent) {
              paginationData.current = maxCurrent
            }
          }

          fetchData()
        },
      },
    )

    return <Pagination {...(props || {})} />
  }

  function createFormComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    if (!formCtx) {
      return
    }

    return <formCtx.Component {...(ctx?.attrs || {})} />
  }
}
