import type { InjectionKey } from 'vue'
import { defineContext } from '../../../hooks'
import type { IFormInteralContext } from './createForm'

const key = Symbol() as InjectionKey<IFormInteralContext>

/**
 * todo: Not used, should clean it?
 */
export const useForm = defineContext(key)
