import { mount } from '@vue/test-utils'
import { defineComponent, onMounted } from 'vue'
import type { VueComponent } from '../types'
import { useComponentWrapper } from './useComponentWrapper'

describe('useComponentWrapper', () => {
  it('should works', async () => {
    type Methods = {
      add: (a: number, b: number) => number
    }

    const CompA: VueComponent<{ content?: string }, {}, {}, Methods> = defineComponent({
      props: {
        content: String,
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
            content: 'content',
          },
        })

        onMounted(() => {
          result = A.ins?.add(1, 2)
        })

        return {
          A: A.Component,
        }
      },
      template: `<component :is="A"> <p>123</p> </component>`,
    })

    const wrapper = mount(App)

    expect(wrapper.find('span').text().trim()).toBe('content')
    expect(wrapper.find('p').text().trim()).toBe('123')
    expect(result).toBe(3)
  })
})
