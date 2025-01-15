import InputText from 'primevue/inputtext'
import { FormConfig, registerComponent } from '../src/components/v-form/configs'
import FormItem from './FormItem.vue'
import { defineForm, type IFormContext, type IFormOptions } from '../src/components/v-form'
import { defineComponent, h } from 'vue'
import Button from 'primevue/button'
import { useLoading } from '../src/hooks'
import type { VueComponent } from '../src/types'

export function registerAllFormComponents() {
  registerComponent('Input', InputText)
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
          Button,
          {
            type: 'submit',
            label: props.label || 'Submit',
            onClick: handleClick,
            loading: handleClick.isLoading,
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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Submit: VueComponent<{ onSubmit: (data: unknown) => any }>
}
