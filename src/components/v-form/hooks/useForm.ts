import { defineContext } from 'src/hooks'
import { ref, type InjectionKey, type Ref } from 'vue'
import type { VFormFieldProps } from '../types'
import { ensureArray, type Arrayable } from '@0x-jerry/utils'
import { type IRule, validate as runValidate } from '../rules'
import { getValue, setValue } from '../utils'

export interface IFormContext {
  data: Ref<Record<string, unknown>>
}

export interface IFormInteralContext extends IFormContext {
  fileds: VFormFieldProps[]
  globalRules: Record<string, Arrayable<IRule>>
}

type IFormFieldType = VFormFieldProps['field']

const key = Symbol() as InjectionKey<IFormInteralContext>

export const useForm = defineContext(key, createFormContext)

export function createFormContext(): IFormInteralContext {
  const ctx: IFormInteralContext = {
    data: ref({}),
    fileds: [],
    globalRules: {},
  }

  const actions = {
    addField,
    removeField,
    validate,
    update,
    updateField,
  }

  return ctx

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
        const filedKey = arrayToString(field.field)
        const hit = rules.find((n) => arrayToString(n.field) === filedKey)

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

  async function _validateField(field: IFormFieldType, rules: IRule[]) {
    const fieldKey = arrayToString(field)
    const fieldConfig = ctx.fileds.find((f) => arrayToString(f.field) === fieldKey)

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

  async function validate(field?: IFormFieldType) {
    const rules = _collectFieldRules()

    const p = rules.map((rule) => _validateField(rule.field, rule.rules))

    let errors = await Promise.all(p)
    errors = errors.filter((n) => n != null && n.errors.length > 0)

    return errors as IFieldRuleError[]
  }

  function updateField(field: IFormFieldType, value?: unknown) {
    setValue(ctx.data.value, ensureArray(field), value)
  }

  function update(data: Record<string, unknown>) {
    ctx.data.value = data
  }

  function removeField(field: IFormFieldType) {
    const filedKey = arrayToString(field)
    const hitFieldIndex = ctx.fileds.findIndex((f) => arrayToString(f.field) === filedKey)

    if (hitFieldIndex < 0) {
      throw new Error(`Not found field by key: ${filedKey}`)
    }

    return ctx.fileds.splice(hitFieldIndex, 1)
  }

  function addField(field: VFormFieldProps) {
    const filedKey = arrayToString(field.field)
    const hitField = ctx.fileds.find((f) => arrayToString(f.field) === filedKey)

    if (hitField) {
      throw new Error(`Found the same keys for: ${filedKey}`)
    }

    ctx.fileds.push(field)
  }
}

function arrayToString(arr: Arrayable<unknown>, joinChar = '-') {
  return ensureArray(arr).join(joinChar)
}

interface IFieldRuleCollection {
  field: IFormFieldType
  rules: IRule[]
}

interface IFieldRuleError {
  field: IFormFieldType
  errors: string[]
}
