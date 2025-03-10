import {
  computed,
  ref,
  shallowRef,
  toValue,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import type {
  IFieldRuleCollection,
  IFieldRuleError,
  IFormOptions,
  IFormFieldConfig,
  IFromActions,
} from '../types'
import { ensureArray, remove, type Arrayable } from '@0x-jerry/utils'
import { validateRules, type IRule } from '../rules'
import { calcFieldKey, interopWithContext } from '../utils'
import { getValue, setValue } from '../../../utils'

type IFormFieldPath = IFormFieldConfig['field']

export interface IFormInternalContext extends IFromActions {
  data: Ref<Record<string, unknown>>
  validateErrors: ShallowRef<IFieldRuleError[]>
  fields: ComputedRef<IFormFieldConfig[]>
  globalRules: Record<string, Arrayable<IRule>>
  getVisibleFields: () => IFormFieldConfig[]
}

export function createFormContext(opt: Partial<IFormOptions> = {}): IFormInternalContext {
  const actions: IFromActions = {
    validate,
    validateOnly,
    clearValidate,
    update,
    updateField,
    getData,
    getErrors,
  }

  const ctx: IFormInternalContext = {
    data: ref(opt.data || {}),
    validateErrors: shallowRef([]),
    fields: computed(() => toValue(opt.fields || [])),
    globalRules: opt.rules || {},
    getVisibleFields,
    ...actions,
  }

  return ctx

  function getVisibleFields() {
    const fields = ctx.fields.value

    return fields.filter((f) => (f.if == null ? true : interopWithContext(f.if, ctx)))
  }

  function getErrors(): IFieldRuleError[]
  function getErrors(field: IFormFieldPath): IFieldRuleError | undefined
  function getErrors(field?: IFormFieldPath): IFieldRuleError | undefined | IFieldRuleError[] {
    if (field != null) {
      const key = calcFieldKey(field)
      return ctx.validateErrors.value.find((n) => calcFieldKey(n.field) === key)
    }
    return ctx.validateErrors.value
  }

  function getData(field: IFormFieldPath): unknown
  function getData(): Record<string, unknown>
  function getData(field?: IFormFieldPath) {
    if (field) return getValue(ctx.data.value, ensureArray(field))

    return ctx.data.value
  }

  function _collectFieldRules() {
    const rules = Object.entries(ctx.globalRules).map(([key, value]) => {
      const rule: IFieldRuleCollection = {
        field: key,
        rules: ensureArray(value),
      }

      return rule
    })

    for (const field of ctx.fields.value) {
      const validateRules = ensureArray(field.rules)

      if (validateRules.length) {
        const filedKey = calcFieldKey(field.field)
        const hit = rules.find((n) => calcFieldKey(n.field) === filedKey)

        if (hit) {
          hit.rules.push(...validateRules)
        } else {
          rules.push({
            field: field.field,
            rules: validateRules,
          })
        }
      }
    }

    return rules
  }

  async function _validateField(field: IFormFieldPath, rules: IRule[]) {
    const fieldKey = calcFieldKey(field)
    const fieldConfig = ctx.fields.value.find((f) => calcFieldKey(f.field) === fieldKey)

    if (!fieldConfig) {
      return
    }

    const value = getValue(ctx.data.value, ensureArray(field))

    const errors = await validateRules({
      label: fieldConfig.label,
      required: fieldConfig.required,
      value,
      rule: rules,
    })

    const result: IFieldRuleError = {
      field,
      errors,
    }

    return result
  }

  function _getFieldConfig(field: IFormFieldPath) {
    const filedKey = calcFieldKey(field)
    const hit = ctx.fields.value.find((f) => calcFieldKey(f.field) === filedKey)
    return hit
  }

  function _getFieldRules(field: IFormFieldPath) {
    const filedKey = calcFieldKey(field)

    const rules = ensureArray(ctx.globalRules[filedKey])

    const fieldConfig = _getFieldConfig(field)

    if (fieldConfig?.rules) {
      rules.push(...ensureArray(fieldConfig.rules))
    }

    const result: IFieldRuleCollection = {
      field,
      rules,
    }

    return [result]
  }

  function clearValidate() {
    ctx.validateErrors.value = []
  }

  function _updateValidateErrors(errors: IFieldRuleError[], field?: IFormFieldPath) {
    if (!field) {
      ctx.validateErrors.value = errors
      return
    }

    const newErrors = [...ctx.validateErrors.value]
    const key = calcFieldKey(field)
    remove(newErrors, (n) => calcFieldKey(n.field) === key)
    newErrors.push(...errors)

    ctx.validateErrors.value = newErrors
  }

  async function validateOnly(field?: IFormFieldPath) {
    const rules = field ? _getFieldRules(field) : _collectFieldRules()

    const p = rules.map((rule) => _validateField(rule.field, rule.rules))

    const errors = (await Promise.all(p))
      .filter((n) => n != null)
      .filter((n) => n.errors.length > 0)

    _updateValidateErrors(errors as IFieldRuleError[], field)

    return errors
  }

  async function validate<T>(field?: IFormFieldPath) {
    const errors = await validateOnly(field)
    if (errors.length) {
      throw errors
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return getData(field!) as T
  }

  function updateField(field: IFormFieldPath, value?: unknown) {
    setValue(ctx.data.value, ensureArray(field), value)
  }

  function update(data?: Record<string, unknown>) {
    ctx.data.value = data || {}
  }
}
