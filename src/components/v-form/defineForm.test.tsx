import { defineComponent, nextTick, onMounted } from 'vue'
import { defineForm } from './defineForm'
import { mount } from '@vue/test-utils'
import { registerComponent, unregisterComponent } from './configs'
import { useVModel } from '@vueuse/core'

function setupFormComponents() {
  const TestInputComponent = defineComponent({
    props: {
      modelValue: String,
    },
    emits: ['update:modelValue'],
    setup: (props) => {
      const value = useVModel(props)

      return () => <input v-model={value.value} />
    },
  })

  beforeAll(() => {
    registerComponent('Input', TestInputComponent)
  })

  afterAll(() => {
    unregisterComponent('Input')
  })
}

setupFormComponents()

describe('VForm', () => {
  it('basic usage', () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        fields: [
          {
            label: 'input label',
            field: 'key1',
            compoennt: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp)

    expect(app.get('form')).toBeTruthy()
    expect(app.get('input')).toBeTruthy()
    expect(app.get('.v-form-field').attributes('data-key')).toBe('key1')
  })

  it('default field value', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        data: {
          input: 'default value',
        },
        fields: [
          {
            label: 'This is input',
            field: 'input',
            compoennt: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp)
    expect(app.get('input').element.value).toBe('default value')
  })

  it('modify field value', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        fields: [
          {
            label: 'This is input',
            field: 'input',
            compoennt: 'Input',
          },
        ],
      })

      onMounted(() => {
        form.updateField('input', '1234')
      })

      return () => <form.Component />
    })

    const app = mount(Comp)
    await nextTick()
    expect(app.get('input').element.value).toBe('1234')
  })
})
