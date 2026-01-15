import { mount } from '@vue/test-utils'
import { defineComponent, type Ref, reactive, ref } from 'vue'
import { defineStrictContext } from './defineStrictContext'

describe('defineContext', () => {
  it('test with parameters', async () => {
    const useCount = defineStrictContext('key', (opt: { count: Ref<number> }) => {
      const state = reactive({
        count: opt.count,
        add() {
          opt.count.value++
        },
      })

      return state
    })

    const Child = defineComponent({
      setup() {
        const p = useCount()

        return {
          p,
        }
      },
      template: `<button @click="p.add()">{{p.count}}</button>`,
    })

    const App = defineComponent({
      components: { B: Child },
      setup() {
        const p = useCount.provide({
          count: ref(0),
        })

        return {
          p,
        }
      },
      template: `<div :count="p.count"><B /></div>`,
    })

    const wrapper = mount(App)

    expect(wrapper.attributes()?.['count']).toBe('0')
    expect(wrapper.get('button').text()).toBe('0')

    await wrapper.get('button').trigger('click')
    expect(wrapper.attributes()?.['count']).toBe('1')
    expect(wrapper.get('button').text()).toBe('1')
  })

  it('should throw error when missing context key', () => {
    const useCount = defineStrictContext('key', () => {})

    const Child = defineComponent({
      setup() {
        useCount()
      },
      template: `<button>1</button>`,
    })

    const App = defineComponent({
      components: { B: Child },
      setup() {},
      template: `<div><B /></div>`,
    })

    expect(() => mount(App)).to.throw('Can not find context key: key')
  })
})
