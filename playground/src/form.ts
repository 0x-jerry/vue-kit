import {
  defineForm,
  FormConfig,
  type IFormContext,
  type IFormOptions,
  registerComponent,
} from '@0x-jerry/vue-kit/components/v-form'
import { useLoading } from '@0x-jerry/vue-kit/hooks'
import { defineComponent, h } from 'vue'
import { VBtn, VCheckbox, VSelect, VTextField } from 'vuetify/components'
import FormItem from './FormItem.vue'

export function registerAllFormComponents() {
  registerComponent('Input', VTextField)
  registerComponent('Checkbox', VCheckbox)
  registerComponent('Select', VSelect)

  FormConfig.FieldItem = FormItem
}

export function defineAForm(opt: Partial<IFormOptions>) {
  const form = defineForm(opt) as IAFormContext

  const SubmitComponent = defineComponent({
    props: {
      label: String,
      onSubmit: Function,
    },
    setup: (props, ctx) => {
      const handleClick = useLoading(_handleClick)

      async function _handleClick() {
        const values = await form.validate()

        await props?.onSubmit?.(values)
      }

      return () =>
        h(
          VBtn,
          {
            type: 'submit',
            text: props.label || 'Submit',
            onClick: handleClick,
            loading: handleClick.isLoading,
            variant: 'elevated',
            color: 'primary',
          },
          ctx.slots,
        )
    },
  })

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form.Submit = SubmitComponent as any

  return form
}

export type IAFormContext = IFormContext & {
  Submit: typeof VBtn
}
