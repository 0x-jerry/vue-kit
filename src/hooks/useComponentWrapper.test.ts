import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, onMounted } from 'vue'
import type { VueComponent } from '../types'
import { useComponentWrapper } from './useComponentWrapper'

describe('useComponentWrapper', () => {
  it('should works', async () => {
    type Methods = {
      add: (a: number, b: number) => number
    }

    const CompA: VueComponent<{ content?: string }, {}, {}, Methods> = defineComponent({
      props: {
        content: String
      },
      setup(_, ctx) {
        ctx.expose({
          add(a: number, b: number) {
            return a + b
          },
        })

        return {}
      },
      template: `<div><span>{{content}}</span><slot /></div>`,
    })

    let result: number | undefined = 0
    const App = defineComponent({
      setup() {
        const A = useComponentWrapper(CompA, {
          props: {
            content: 'content'
          }
        })

        onMounted(() => {
          result = A.ins?.add(1,2)
        })

        return {
          A,
        }
      },
      template: `<A> <p>123</p> </A>`,
    })

    const wrapper = mount(App)
    expect(result).toBeUndefined()
    await nextTick()

    expect(result).toBe(3)
    expect(wrapper.find('span').text().trim()).toBe('conetnt')
    expect(wrapper.find('p').text().trim()).toBe('123')
  })
})
