import { mergeProps, type FunctionalComponent, type Slots } from 'vue'
import type { IFormFieldConfig, IFromActions, IFormOptions } from './types'
import { FormConfig, resolveRegisteredComponent } from './configs'
import { calcFieldKey, interopWithContext } from './utils'
import { isString } from '@0x-jerry/utils'
import { VLayout } from '../v-layout'
import { createFormContext } from './hooks/createFormContext'
import type { FunctionalSetupContext } from '../../utils'

export interface IFormContext extends IFromActions {
  Component: FunctionalComponent
}

/**
 *
 * @param config
 * @returns
 */
export function defineForm(config: Partial<IFormOptions>): IFormContext {
  const formContext = createFormContext(config)

  const exposeFormContext = formContext as unknown as IFormContext

  Object.assign(exposeFormContext, {
    Component: createWrapperComponent,
  })

  return exposeFormContext

  function createWrapperComponent(_props: Record<string, unknown>, ctx: FunctionalSetupContext) {
    const fields = formContext.getVisibleFields()

    const formProps = mergeProps(
      {
        class: config.class,
      },
      ctx.attrs,
      {
        class: 'v-form',
        onSubmit: (e: Event) => e.preventDefault(),
      },
    )

    const layoutProps = {
      type: 'flex-col' as const,
      ...config.layout,
    }

    return (
      <form {...formProps}>
        <VLayout {...layoutProps}>{fields.map((field) => renderField(field, ctx.slots))}</VLayout>
      </form>
    )
  }

  function renderField(item: IFormFieldConfig, slots: Slots) {
    const Ctor = _resolveComponent(item, slots) as FunctionalComponent | undefined

    if (!Ctor) return

    const triggerValidateOn = config.triggerValidateOn || 'change'

    const showField = item.show == null ? true : interopWithContext(item.show, formContext)

    const fieldError = formContext.getErrors(item.field)

    const fieldKey = calcFieldKey(item.field)

    const validateField = () => formContext.validate(item.field)

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const fieldComponentProps = mergeProps({}, item.componentProps as any, {
      modelValue: formContext.getData(item.field),
      'onUpdate:modelValue': (val: unknown) => formContext.updateField(item.field, val),
      validateStatus: fieldError ? 'error' : undefined,
      onBlur: triggerValidateOn === 'blur' ? validateField : undefined,
      onChange: triggerValidateOn === 'change' ? validateField : undefined,
      onInput: triggerValidateOn === 'change' ? validateField : undefined,
    })

    const fieldProps = mergeProps(
      {
        class: item.class,
        style: item.style,
        item,
        fieldError,
      },
      {
        class: 'v-form-field',
        key: fieldKey,
        'data-key': fieldKey,
      },
    )

    const FieldItem = FormConfig.FieldItem as FunctionalComponent

    return (
      <FieldItem {...fieldProps} v-show={showField}>
        {{
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          default: (props: any) => <Ctor {...mergeProps(props, fieldComponentProps)} />,
        }}
      </FieldItem>
    )
  }

  function _resolveComponent(item: IFormFieldConfig, slots: Slots) {
    const Component = item.slot
      ? slots[item.slot]
      : isString(item.component)
        ? resolveRegisteredComponent(item.component)?.Ctor
        : item.component

    return Component
  }
}
