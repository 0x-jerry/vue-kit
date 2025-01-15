import { defineComponent, nextTick, onMounted } from 'vue'
import { defineForm, type IFormContext } from './defineForm'
import { mount } from '@vue/test-utils'
import { registerComponent, unregisterComponent } from './configs'
import { useVModel } from '@vueuse/core'
import { sleep } from '@0x-jerry/utils'

const TestInputComponent = defineComponent({
  props: {
    modelValue: String,
    validateStatus: String,
  },
  emits: ['update:modelValue', 'change', 'blur'],
  setup: (props, ctx) => {
    const value = useVModel(props)

    return () => (
      <input
        class={{
          'is-error': props.validateStatus,
        }}
        v-model={value.value}
        onInput={() => ctx.emit('change')}
        onBlur={() => ctx.emit('blur')}
      />
    )
  },
})

declare module './types' {
  interface FormComponentMapSetting {
    Input: typeof TestInputComponent
  }
}

function setupFormComponents() {
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
            component: 'Input',
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
            component: 'Input',
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
            component: 'Input',
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

  it('update field value', async () => {
    let form = {} as IFormContext

    const Comp = defineComponent(() => {
      form = defineForm({
        data: {
          i0: '',
        },
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp)

    const field = app.get('.v-form-field')
    expect(form.getData('i0')).toBe('')

    await field.get('input').setValue('123')
    expect(form.getData('i0')).toBe('123')
  })

  it('if condition', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
          {
            label: 'i1',
            field: 'i1',
            component: 'Input',
            if: false,
          },
          {
            label: 'i2',
            field: 'i2',
            component: 'Input',
            if: () => true,
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp)
    const allfields = app.findAll('.v-form-field')

    expect(allfields.length).toBe(2)
    expect(allfields.at(0)?.attributes('data-key')).toBe('i0')
    expect(allfields.at(1)?.attributes('data-key')).toBe('i2')
  })

  it('show condition', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
          {
            label: 'i1',
            field: 'i1',
            component: 'Input',
            show: false,
          },
          {
            label: 'i2',
            field: 'i2',
            component: 'Input',
            show: () => true,
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp, {
      attachTo: document.body,
    })

    const allfields = app.findAll('.v-form-field')

    expect(allfields.length).toBe(3)
    expect(allfields.at(0)?.attributes('data-key')).toBe('i0')
    expect(allfields.at(0)?.isVisible()).toBe(true)

    expect(allfields.at(1)?.attributes('data-key')).toBe('i1')
    expect(allfields.at(1)?.isVisible()).toBe(false)

    expect(allfields.at(2)?.attributes('data-key')).toBe('i2')
    expect(allfields.at(2)?.isVisible()).toBe(true)
  })

  it('validate on change', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        rules: {
          i0: {
            type: 'string',
            max: 2,
          },
        },
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp, {
      attachTo: document.body,
    })

    const field = app.get('.v-form-field')
    expect(field.get('.v-form-field-error').isVisible()).toBe(false)

    await field.get('input').setValue('123')

    // Ensure validate process is done and dom updated
    await sleep()

    expect(field.get('.v-form-field-error').isVisible()).toBe(true)
  })

  it('validate on blur', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        triggerValidateOn: 'blur',
        rules: {
          i0: {
            type: 'string',
            max: 2,
          },
        },
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp, {
      attachTo: document.body,
    })

    const field = app.get('.v-form-field')
    expect(field.get('.v-form-field-error').isVisible()).toBe(false)

    await field.get('input').setValue('123')

    // Ensure validate process is done and dom updated
    await sleep()
    expect(field.get('.v-form-field-error').isVisible()).toBe(false)

    await field.get('input').trigger('blur')
    // Ensure validate process is done and dom updated
    await sleep()
    expect(field.get('.v-form-field-error').isVisible()).toBe(true)
  })

  it('render field validate error', async () => {
    const Comp = defineComponent(() => {
      const form = defineForm({
        rules: {
          i0: {
            type: 'string',
            max: 2,
          },
        },
        fields: [
          {
            label: 'i0',
            field: 'i0',
            component: 'Input',
          },
        ],
      })

      return () => <form.Component />
    })

    const app = mount(Comp, {
      attachTo: document.body,
    })

    const field = app.get('.v-form-field')
    expect(field.get('input').classes('is-error')).toBe(false)

    await field.get('input').setValue('123')
    // Ensure validate process is done and dom updated
    await sleep()

    expect(field.get('input').classes('is-error')).toBe(true)
  })
})
