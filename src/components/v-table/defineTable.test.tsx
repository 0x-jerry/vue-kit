import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
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
            data: [],
            total: 0,
          }
        },
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
          },
        ],
      })

      return () => <table.Component />
    })

    const app = mount(App)

    expect(app.get('.v-table-wrapper')).toBeTruthy()
  })
})
