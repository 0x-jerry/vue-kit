import { mergeProps, type FunctionalComponent, type Slots } from 'vue'
import type { IFormFieldConfig, IFromActions, IFormOptions } from './types'
import { resolveRegisteredComponent } from './configs'
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

    return (
      <form {...formProps}>
        <VLayout {...config.layout}>{fields.map((field) => renderField(field, ctx.slots))}</VLayout>
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

    const fieldComponentProps = mergeProps(item.componentProps || {}, {
      modelValue: formContext.getData(item.field),
      'onUpdate:modelValue': (val: unknown) => formContext.updateField(item.field, val),
      validateStatus: fieldError ? 'error' : undefined,
      onBlur: triggerValidateOn === 'blur' ? validateField : undefined,
      onChange: triggerValidateOn === 'change' ? validateField : undefined,
    })

    const fieldProps = mergeProps(
      {
        class: item.class,
        style: item.style,
      },
      {
        class: 'v-form-field',
        key: fieldKey,
        'data-key': fieldKey,
      },
    )

    return (
      <div {...fieldProps} v-show={showField}>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label class="v-form-label">
          <span>{item.label}</span>
        </label>
        <div class="v-form-field-content">
          <Ctor {...fieldComponentProps} />
          <div class="v-form-field-error" v-show={fieldError}>
            {fieldError?.errors.at(0)}
          </div>
        </div>
      </div>
    )
  }

  function _resolveComponent(item: IFormFieldConfig, slots: Slots) {
    const Component = item.slot
      ? slots[item.slot]
      : isString(item.compoennt)
        ? resolveRegisteredComponent(item.compoennt)?.Ctor
        : item.compoennt

    return Component
  }
}
