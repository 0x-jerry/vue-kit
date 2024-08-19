import { defineContext } from 'src/hooks'
import { ref, type InjectionKey, type Ref } from 'vue'
import type { VFormFieldProps } from '../types'
import { ensureArray, type Arrayable } from '@0x-jerry/utils'
import { type IRule, validate as runValidate } from '../rules'
import { getValue, setValue } from '../utils'

type IFormFieldPath = VFormFieldProps['field']

export interface IFromActions {
  addField: (field: VFormFieldProps) => void;
  removeField: (field: IFormFieldPath) => VFormFieldProps[];
  validate: (field?: IFormFieldPath) => Promise<IFieldRuleError[]>;
  update: (data: Record<string, unknown>) => void;
  updateField: (field: IFormFieldPath, value?: unknown) => void;
  getData: () => Record<string, unknown>
}

export interface IFormInteralContext extends IFromActions {
  data: Ref<Record<string, unknown>>
  fileds: VFormFieldProps[]
  globalRules: Record<string, Arrayable<IRule>>
}


const key = Symbol() as InjectionKey<IFormInteralContext>

export const useForm = defineContext(key, createFormContext)

export function createFormContext(): IFormInteralContext {
  const actions: IFromActions = {
    addField,
    removeField,
    validate,
    update,
    updateField,
    getData,
  }

  const ctx: IFormInteralContext = {
    data: ref({}),
    fileds: [],
    globalRules: {},
    ...actions
  }

  return ctx

  function getData() {
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

    for (const field of ctx.fileds) {
      const validateRules = ensureArray(field.rules)

      if (validateRules.length) {
        const filedKey = fieldArrayToString(field.field)
        const hit = rules.find((n) => fieldArrayToString(n.field) === filedKey)

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
    const fieldKey = fieldArrayToString(field)
    const fieldConfig = ctx.fileds.find((f) => fieldArrayToString(f.field) === fieldKey)

    if (!fieldConfig) {
      return
    }

    const errors: string[] = []

    for (const rule of rules) {
      const value = getValue(ctx.data.value, ensureArray(field))
      const error = await runValidate({
        label: fieldConfig.label,
        value,
        rule,
      })

      if (error) {
        errors.push(error)
      }
    }

    const result: IFieldRuleError = {
      field,
      errors,
    }

    return result
  }

  function _getFieldConfig(field: IFormFieldPath) {
    const filedKey = fieldArrayToString(field)
    const hit = ctx.fileds.find((f) => fieldArrayToString(f.field) === filedKey)
    return hit
  }

  function _getFieldRules(field: IFormFieldPath) {
    const filedKey = fieldArrayToString(field)

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

  async function validate(field?: IFormFieldPath) {
    const rules = field ? _getFieldRules(field) : _collectFieldRules()

    const p = rules.map((rule) => _validateField(rule.field, rule.rules))

    let errors = await Promise.all(p)
    errors = errors.filter((n) => n != null && n.errors.length > 0)

    return errors as IFieldRuleError[]
  }

  function updateField(field: IFormFieldPath, value?: unknown) {
    setValue(ctx.data.value, ensureArray(field), value)
  }

  function update(data: Record<string, unknown>) {
    ctx.data.value = data
  }

  function removeField(field: IFormFieldPath) {
    const filedKey = fieldArrayToString(field)
    const hitFieldIndex = ctx.fileds.findIndex((f) => fieldArrayToString(f.field) === filedKey)

    if (hitFieldIndex < 0) {
      throw new Error(`Not found field by key: ${filedKey}`)
    }

    return ctx.fileds.splice(hitFieldIndex, 1)
  }

  function addField(field: VFormFieldProps) {
    const filedKey = fieldArrayToString(field.field)
    const hitField = ctx.fileds.find((f) => fieldArrayToString(f.field) === filedKey)

    if (hitField) {
      throw new Error(`Found the same keys for: ${filedKey}`)
    }

    ctx.fileds.push(field)
  }
}

function fieldArrayToString(arr: Arrayable<unknown>) {
  return ensureArray(arr).join('.')
}

interface IFieldRuleCollection {
  field: IFormFieldPath
  rules: IRule[]
}

interface IFieldRuleError {
  field: IFormFieldPath
  errors: string[]
}
