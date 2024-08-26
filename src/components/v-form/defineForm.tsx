import { computed, toValue, type FunctionalComponent, type Slots } from 'vue'
import type {
  IFormEvalFunction,
  IFormFieldConfig,
  IFromActions,
  IFormConfig,
  IToValue,
} from './types'
import { getComponent } from './configs'
import { calcFieldKey } from './utils'
import { isFn, isString } from '@0x-jerry/utils'
import { VLayout } from '../v-layout'
import { createFormContext } from './hooks/createForm'

export interface IFormContext extends IFromActions {
  Component: FunctionalComponent
}

/**
 * todo, support reactive data? or provide apis to change state?
 */
interface IDefineFormConfig extends IFormConfig {
  fields?: IToValue<IFormFieldConfig[]>
}

/**
 *
 * !!!All methods are only avaiable after mounted
 *
 * @param config
 * @returns
 */
export function defineForm(config: Partial<IDefineFormConfig>): IFormContext {
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

      // todo, calculate render fields
      const fields = formContext.fields.value

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

    if (item.if != null && !interopWithContext(item.if, exposeFormContext)) {
      return
    }

    const props = {
      ...item.componentProps,
      key: calcFieldKey(item.field),
      modelValue: exposeFormContext.getData(item.field),
      'onUpdate:modelValue': (val: unknown) => exposeFormContext.updateField(item.field, val),
    }

    const show = item.show == null ? true : interopWithContext(item.show, exposeFormContext)

    const fieldError = exposeFormContext.getErrors?.(item.field)

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
