import { h, mergeProps, type FunctionalComponent } from 'vue'

export const configs: ITableConfig = {
  Components: {
    Table: (props, ctx) => h('div', mergeProps({ class: 'table' }, props), ctx.slots),
    Column: (props, ctx) => h('div', mergeProps({ class: 'column' }, props), ctx.slots),
    Pagination: (props, ctx) => h('div', mergeProps({ class: 'pagination' }, props), ctx.slots),
  },
}

export interface ITableConfig {
  Components: {
    Table: FunctionalComponent
    Column: FunctionalComponent
    Pagination: FunctionalComponent
  }
}
