import type { Component, FunctionalComponent, Slots } from 'vue'
import VForm from './VForm.vue'
import type { IFromActions } from './hooks/useForm'
import type { IFormEvalFunction, VFormFieldProps, VFormProps } from './types'
import { getComponent } from './configs'
import { calcFieldKey } from './utils'
import { isFn, isString } from '@0x-jerry/utils'
import { useInstanceRef } from '../../hooks'

export interface IFormContext extends IFromActions {
  Component: FunctionalComponent
}

/**
 * todo, support reactive data? or provide apis to change state?
 */
export interface IDefineFormConfig extends Omit<VFormProps, 'fields'> {
  fields?: IFormFieldConfig[]
}

interface IFormFieldConfig extends VFormFieldProps {
  slot?: string
  compoennt?: string | Component
  componentProps?: Record<string, unknown>
}

/**
 *
 * !!!All methods are only avaiable after mounted
 *
 * @param option
 * @returns
 */
export function defineForm(option: Partial<IDefineFormConfig>): IFormContext {
  const Component = createWrapperComponent()
  const instance = useInstanceRef(VForm)

  const instanceActions = new Proxy({} as IFormContext, {
    get(_target, p, _receiver) {
      if (p === 'Component') {
        return Component
      }

      const formCtx = instance.value?.formContext

      return formCtx?.[p as keyof IFromActions]
    },
  })

  return instanceActions

  function createWrapperComponent() {
    const Component: FunctionalComponent = (_props, ctx) => {
      const formProps: Record<string, unknown> = {
        ...option,
        ...ctx.attrs,
        ref: instance,
      }

      return (
        <VForm {...formProps}>
          {(option.fields || []).map((field) => renderField(field, ctx.slots))}
        </VForm>
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

    if (item.if != null && !interopWithContext(item.if, instanceActions)) {
      return
    }

    const props = {
      ...item.componentProps,
      key: calcFieldKey(item.field),
      modelValue: instanceActions.getData?.(item.field),
      'onUpdate:modelValue': (val: unknown) => instanceActions.updateField?.(item.field, val),
    }

    const show = item.show == null ? true : interopWithContext(item.show, instanceActions)

    const filedError = instanceActions.getErrors?.(item.field)

    return (
      <div class="v-form-field" data-key={calcFieldKey(item.field)}>
        <label class="v-form-label">{item.label}</label>
        <div v-show={filedError} class="v-form-field-error">
          {filedError?.errors.at(0)}
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
