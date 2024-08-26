import type { FunctionalComponent, Slots } from 'vue'
import { createFormContext, useForm, type IFromActions } from './hooks/useForm'
import type { IFormEvalFunction, IFormFieldConfig, VFormProps } from './types'
import { getComponent } from './configs'
import { calcFieldKey } from './utils'
import { isFn, isString } from '@0x-jerry/utils'
import { VLayout } from '../v-layout'

export interface IFormContext extends IFromActions {
  Component: FunctionalComponent
}

/**
 * todo, support reactive data? or provide apis to change state?
 */
interface IDefineFormConfig extends VFormProps {
  fields?: IFormFieldConfig[]
}

/**
 *
 * !!!All methods are only avaiable after mounted
 *
 * @param option
 * @returns
 */
export function defineForm(option: Partial<IDefineFormConfig>): IFormContext {
  const _formContext = createFormContext() 
  const formContext = _formContext as unknown as IFormContext

  const Component = createWrapperComponent() 

  Object.defineProperty(formContext, 'Component', {
    value: Component
  })

  return formContext

  function createWrapperComponent() {
    const Component: FunctionalComponent = (_props, ctx) => {
      useForm.provide(_formContext)

      const onSubmit = (e: Event) => {
        e.preventDefault()
      }

      return (
        <form class="v-form" onSubmit={onSubmit}>
          <VLayout {...option.layout}>
            {(option.fields || []).map((field) => renderField(field, ctx.slots))}
          </VLayout>
        </form>
      )
    }

    return Component
  }

  function renderField(item: IFormFieldConfig, slots: Slots) {
    const Ctor = item.slot
      ? slots[item.slot]
      : isString(item.compoennt)
        ? (getComponent(item.compoennt)?.Ctor as FunctionalComponent)
        : (item.compoennt as FunctionalComponent | undefined)

    if (!Ctor) return

    if (item.if != null && !interopWithContext(item.if, formContext)) {
      return
    }

    const props = {
      ...item.componentProps,
      key: calcFieldKey(item.field),
      modelValue: formContext.getData?.(item.field),
      'onUpdate:modelValue': (val: unknown) => formContext.updateField?.(item.field, val),
    }

    const show = item.show == null ? true : interopWithContext(item.show, formContext)

    const fieldError = formContext.getErrors?.(item.field)

    return (
      <div class="v-form-field" data-key={calcFieldKey(item.field)}>
        <label class="v-form-label">{item.label}</label>
        <div v-show={fieldError} class="v-form-field-error">
          {fieldError?.errors.at(0)}
        </div>
        <div class="v-form-field-content">
          <Ctor v-show={show} {...props} />
        </div>
      </div>
    )
  }
}

function interopWithContext(item: IFormEvalFunction<boolean> | boolean, ctx: IFromActions) {
  return isFn(item) ? item(ctx) : item
}
