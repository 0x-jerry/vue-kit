import { mount } from '@vue/test-utils'
import { defineComponent, type InjectionKey, type Ref, reactive, ref } from 'vue'
import { defineContext } from './defineContext'

describe('defineContext', () => {
  it('test with parameters', async () => {
    const useCount = defineContext('key', (opt: { count: Ref<number> }) => {
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

  it('test with object', async () => {
    const key = Symbol('key') as InjectionKey<{ count: number }>
    const useCount = defineContext(key)

    const Child = defineComponent({
      setup() {
        const p = useCount()

        return {
          p,
        }
      },
      template: `<button @click="p.count ++ ">{{p.count}}</button>`,
    })

    const App = defineComponent({
      components: { B: Child },
      setup() {
        const p = useCount.provide(reactive({ count: 0 }))

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
})
