import { mergeProps, type FunctionalComponent } from 'vue'
import type { ITableActions } from './hooks/types'
import type { ITableOptions } from './types'
import { createTable } from './hooks/createTable'
import { configs } from './configs'
import { defGetter, type FunctionalSetupContext } from '../../utils'
import { defineForm, type IFormContext } from '../v-form'

export interface ITableContext<T> extends ITableActions<T> {
  Component: FunctionalComponent
  Table: FunctionalComponent
  Form: FunctionalComponent
  Pagination: FunctionalComponent

  form?: IFormContext
}

export function defineTable<T>(config: ITableOptions<T>) {
  const tableContext = createTable(config)

  const exposeTableContext = tableContext as unknown as ITableContext<T>

  if (config.form) {
    const form = defineForm(config.form)
    defGetter(exposeTableContext, 'form', form)
  }

  defGetter(exposeTableContext, 'Component', createWrapperComponent)
  defGetter(exposeTableContext, 'Table', createTableComponent)
  defGetter(exposeTableContext, 'Form', createFormComponent)
  defGetter(exposeTableContext, 'Pagination', createPaginationComponent)

  return exposeTableContext

  function createWrapperComponent(_props?: Record<string, unknown>, ctx?: FunctionalSetupContext) {
    const Table = createTableComponent()
    const Form = createFormComponent()

    const Pagination = createPaginationComponent()

    return (
      <div class="v-form" v-bind={ctx?.attrs || {}}>
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
    const formCtx = exposeTableContext.form
    if (!formCtx) {
      return
    }

    return <formCtx.Component v-bind={ctx?.attrs || {}} />
  }
}
