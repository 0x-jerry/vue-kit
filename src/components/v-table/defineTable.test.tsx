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
        data: (_opt) => {
          return {
            data: [] as TableRecord[],
            total: 100,
          }
        },
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            render: (props) => props.dataIndex,
          },
          {
            title: 'Name',
            dataIndex: 'name',
            render: (props) => props.dataIndex,
          },
          {
            title: 'Other',
            key: 'other',
            render: (props) => `${props.data.id} ${props.data.name}`,
          },
        ],
      })

      return () => <table.Component />
    })

    const app = mount(App)

    expect(app.get('.v-table')).toBeTruthy()
  })
})
