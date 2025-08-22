import { isString } from '@0x-jerry/utils'
import { defineComponent, type FunctionalComponent, mergeProps, type Slots } from 'vue'
import type { FunctionalSetupContext } from '../../utils'
import { VLayout } from '../v-layout'
import { FormConfig, resolveRegisteredComponent } from './configs'
import { createFormContext } from './hooks/createFormContext'
import type {
  IFormFieldConfig,
  IFormOptions,
  IFromActions,
  IFromItemProps,
  IFromItemRenderProps,
} from './types'
import { calcFieldKey, interopWithContext } from './utils'

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
    Component: defineComponent((_props, ctx) => () => renderFormContent(_props, ctx)),
  })

  return exposeFormContext

  function renderFormContent(_props: Record<string, unknown>, ctx: FunctionalSetupContext) {
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
      gap: 0,
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

    const validateField = () => formContext.getValidateResult(item.field)

    const fieldRenderProps: IFromItemRenderProps = {
      modelValue: formContext.getData(item.field),
      'onUpdate:modelValue': (val: unknown) => formContext.updateField(item.field, val),
      validateStatus: fieldError ? 'error' : undefined,
      onBlur: triggerValidateOn === 'blur' ? validateField : undefined,
      onChange: triggerValidateOn === 'change' ? validateField : undefined,
      onInput: triggerValidateOn === 'change' ? validateField : undefined,
    }

    const fieldComponentProps = mergeProps(
      {},
      item.componentProps || {},
      fieldRenderProps as unknown as Record<string, unknown>,
    )

    const fieldItemProps = mergeProps(
      {
        class: item.class,
        style: item.style,
      },
      {
        class: 'v-form-field',
        key: fieldKey,
        'data-key': fieldKey,
      },
      {
        fieldConfig: item,
        fieldError: fieldError,
      } satisfies IFromItemProps,
    )

    const FieldItem = FormConfig.FieldItem as FunctionalComponent

    return (
      <FieldItem {...fieldItemProps} v-show={showField}>
        <Ctor {...fieldComponentProps} />
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
