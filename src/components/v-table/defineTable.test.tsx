import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { defineTable } from './defineTable'

describe('VForm', () => {
  it('basic usage', () => {
    interface TableRecord {
      id: number
      name: string
      email?: string
    }

    const App = defineComponent(() => {
      const table = defineTable({
        columns: [{
          title: 'ID',
          dataIndex: 'id',
          render: (props) => props.data
        }, {
          title: 'Name',
          dataIndex: 'name',
          render: (props) => props.data
        }],
        data(opt) {
          return {
            data: [] as TableRecord[],
            total: 100
          }
        },
      })

      return () => <table.Component />
    })

    const app = mount(App)

    expect(app.get('.v-table')).toBeTruthy()
  })
})
