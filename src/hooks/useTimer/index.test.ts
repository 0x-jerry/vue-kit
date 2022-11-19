import { defineComponent, h, Ref, ref } from 'vue'
import { useRepeatTimer, useTimer } from '.'
import { mount } from '@vue/test-utils'
import { sleep } from '@0x-jerry/utils'

describe('useTimer', () => {
  it('should only run once', async () => {
    const comp = mount(createTestComp((v) => useTimer(() => v.value++, 10, { immediate: true })))

    expect(comp.text()).toBe('0')

    await sleep(25)
    expect(comp.text()).toBe('1')

    comp.unmount()
    await sleep(10)
    expect(comp.text()).toBe('1')
  })

  it('should not run immediately', async () => {
    const comp = mount(createTestComp((v) => useTimer(() => v.value++, 10)))

    expect(comp.text()).toBe('0')

    await sleep(25)
    expect(comp.text()).toBe('0')

    comp.unmount()
    await sleep(10)
    expect(comp.text()).toBe('0')
  })

  it('should repeat twice', async () => {
    const comp = mount(createTestComp((v) => useRepeatTimer(() => v.value++, 10)))

    expect(comp.text()).toBe('0')

    await sleep(25)
    expect(comp.text()).toBe('2')

    comp.unmount()
    await sleep(10)

    expect(comp.text()).toBe('2')
  })

  it('should omit error', async () => {
    let count = 0
    const comp = mount(
      createTestComp((v) => {
        useRepeatTimer(
          () => {
            count++
            if (v.value > 1) throw new Error('failed')

            v.value++
          },
          10,
          { omitError: true }
        )
      })
    )

    expect(count).toBe(0)
    expect(comp.text()).toBe('0')

    await sleep(50)
    expect(count).toBe(4)
    expect(comp.text()).toBe('2')

    comp.unmount()
  })

  it('should stop when error happen', async () => {
    let count = 0
    const comp = mount(
      createTestComp((v) => {
        useRepeatTimer(() => {
          count++
          if (v.value > 2) throw new Error('failed')

          v.value++
        }, 10)
      })
    )

    expect(count).toBe(0)
    expect(comp.text()).toBe('0')

    await sleep(100)
    expect(count).toBe(4)
    expect(comp.text()).toBe('3')

    comp.unmount()
  })
})

function createTestComp(setupTimer: (v: Ref<number>) => void) {
  const Comp = defineComponent(() => {
    const v = ref(0)

    setupTimer(v)

    return () => h('div', v.value)
  })

  return Comp
}
