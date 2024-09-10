import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { defineTable } from './defineTable'

describe('VForm', () => {
  it('basic usage', () => {
    const App = defineComponent(() => {
      const table = defineTable({
        columns: [],
        data(opt) {
          return {
            data: [],
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
