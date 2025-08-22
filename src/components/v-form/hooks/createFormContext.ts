import { ensureArray, remove } from '@0x-jerry/utils'
import {
  type ComputedRef,
  computed,
  type Ref,
  ref,
  type ShallowRef,
  shallowRef,
  toValue,
} from 'vue'
import { getValue, setValue } from '../../../utils'
import type {
  IFieldValidateResult,
  IFormFieldConfig,
  IFormFieldPath,
  IFormOptions,
  IFromActions,
} from '../types'
import { interopWithContext, isShallowEqual } from '../utils'

export interface IFormInternalContext extends IFromActions {
  data: Ref<Record<string, unknown>>
  validateErrors: ShallowRef<IFieldValidateResult[]>
  fields: ComputedRef<IFormFieldConfig[]>
  getVisibleFields: () => IFormFieldConfig[]
}

export function createFormContext(opt: Partial<IFormOptions> = {}): IFormInternalContext {
  const actions: IFromActions = {
    validate,
    getValidateResult,
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
    getVisibleFields,
    ...actions,
  }

  return ctx

  function getVisibleFields() {
    const fields = ctx.fields.value

    return fields.filter((f) => (f.if == null ? true : interopWithContext(f.if, ctx)))
  }

  function getErrors(): IFieldValidateResult[]
  function getErrors(field?: IFormFieldPath): IFieldValidateResult | undefined
  function getErrors(
    field?: IFormFieldPath,
  ): IFieldValidateResult[] | IFieldValidateResult | undefined {
    if (field != null) {
      return ctx.validateErrors.value.find((n) => isShallowEqual(n.field, field))
    }

    return ctx.validateErrors.value
  }

  function getData(fieldPath: IFormFieldPath): unknown
  function getData(): Record<string, unknown>
  function getData(fieldPath?: IFormFieldPath) {
    if (fieldPath) return getValue(ctx.data.value, ensureArray(fieldPath))

    return ctx.data.value
  }

  async function _validateField(fieldConfig: IFormFieldConfig) {
    const result: IFieldValidateResult = {
      field: fieldConfig.field,
      issues: [],
    }

    if (!fieldConfig.schema) {
      return result
    }

    const value = getValue(ctx.data.value, ensureArray(fieldConfig.field))

    const validateResult = await fieldConfig.schema['~standard'].validate(value)

    const issues = validateResult.issues?.map((n) => n.message)

    if (issues?.length) {
      result.issues = issues
    }

    return result
  }

  function _getFieldConfig(fieldPath: IFormFieldPath) {
    return ctx.fields.value.find((f) => isShallowEqual(f.field, fieldPath))
  }

  function clearValidate() {
    ctx.validateErrors.value = []
  }

  function _updateValidateErrors(errors: IFieldValidateResult[], fieldPath?: IFormFieldPath) {
    if (!fieldPath) {
      ctx.validateErrors.value = errors
      return
    }

    const newErrors = [...ctx.validateErrors.value]
    remove(newErrors, (n) => isShallowEqual(n.field, fieldPath))
    newErrors.push(...errors)

    ctx.validateErrors.value = newErrors
  }

  async function getValidateResult(fieldPath?: IFormFieldPath) {
    const fieldConfigs = fieldPath ? _getFieldConfig(fieldPath) : [...ctx.fields.value]

    const p = ensureArray(fieldConfigs).map((conf) => _validateField(conf))

    const errors = (await Promise.all(p)).filter((n) => n.issues?.length !== 0)

    _updateValidateErrors(errors, fieldPath)

    return errors
  }

  async function validate<T>(field?: IFormFieldPath) {
    const errors = await getValidateResult(field)
    if (errors.length) {
      throw errors
    }

    return getData(field!) as T
  }

  function updateField(field: IFormFieldPath, value?: unknown) {
    setValue(ctx.data.value, ensureArray(field), value)
  }

  function update(data?: Record<string, unknown>) {
    ctx.data.value = data || {}
  }
}
