import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { useInstanceRef } from './useInstanceRef'

describe('useInstanceRef', () => {
  it('should works', async () => {
    type M = {
      add: (a: number, b: number) => number
    }

    const CompA = defineComponent<{}, {}, {}, {}, M>({
      setup(_, ctx) {
        ctx.expose({
          add(a: number, b: number) {
            return a + b
          },
        })

        return {}
      },
      template: `<div><slot /></div>`,
    })

    const App = defineComponent({
      components: {
        CompA,
      },
      setup() {
        const compRef = useInstanceRef(CompA)

        const a = ref(0)
        onMounted(() => {
          a.value = compRef.value!.add(1, 1)
        })

        return {
          a,
          compRef,
        }
      },
      template: `<CompA ref="compRef"> {{ a }} </CompA>`,
    })

    const wrapper = mount(App)
    await nextTick()

    expect(wrapper.text().trim()).toBe('2')
  })
})
