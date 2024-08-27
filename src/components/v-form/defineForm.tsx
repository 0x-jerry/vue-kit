import { computed, toValue, type FunctionalComponent, type Slots } from 'vue'
import type { IFormFieldConfig, IFromActions, IFormOptions } from './types'
import { getComponent } from './configs'
import { calcFieldKey, interopWithContext } from './utils'
import { isString } from '@0x-jerry/utils'
import { VLayout } from '../v-layout'
import { createFormContext } from './hooks/createForm'

export interface IFormContext extends IFromActions {
  Component: FunctionalComponent
}

/**
 *
 * @param config
 * @returns
 */
export function defineForm(config: Partial<IFormOptions>): IFormContext {
  const formContext = createFormContext()

  formContext.update(config.data)
  formContext.fields = computed(() => toValue(config.fields || []))

  const exposeFormContext = formContext as unknown as IFormContext
  Object.defineProperty(exposeFormContext, 'Component', {
    value: createWrapperComponent(),
  })

  return exposeFormContext

  function createWrapperComponent() {
    const Component: FunctionalComponent = (_props, ctx) => {
      const onSubmit = (e: Event) => {
        e.preventDefault()
      }

      const fields = formContext.getVisibleFields()

      return (
        <form class="v-form" onSubmit={onSubmit}>
          <VLayout {...config.layout}>
            {fields.map((field) => renderField(field, ctx.slots))}
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

    const triggerValidateOn = config.triggerValidateOn || 'change'

    const props = {
      ...item.componentProps,
      key: calcFieldKey(item.field),
      modelValue: formContext.getData(item.field),
      'onUpdate:modelValue': (val: unknown) => formContext.updateField(item.field, val),
      onBlur: () => {
        if (triggerValidateOn === 'blur') {
          formContext.validate(item.field)
        }
      },
      onChange: () => {
        if (triggerValidateOn === 'change') {
          formContext.validate(item.field)
        }
      },
    }

    const showField = item.show == null ? true : interopWithContext(item.show, formContext)

    const fieldError = formContext.getErrors(item.field)

    const fieldKey = calcFieldKey(item.field)

    return (
      <div class="v-form-field" data-key={fieldKey} key={fieldKey} v-show={showField}>
        <label class="v-form-label">{item.label}</label>
        <div v-show={fieldError} class="v-form-field-error">
          {fieldError?.errors.at(0)}
        </div>
        <div class="v-form-field-content">
          <Ctor {...props} />
        </div>
      </div>
    )
  }
}
