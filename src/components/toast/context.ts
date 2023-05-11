import { isString, remove } from '@0x-jerry/utils'
import { installToastApp } from './install'

export interface ToastOption {
  message: string
  /**
   * @default 2000 ms
   */
  duration: number
}

const toastTypes = ['success', 'error', 'info', 'warning'] as const

export type ToastType = (typeof toastTypes)[number]

export type ToastExposeAPI = {
  [key in ToastType]: (opt: ToastOption | string) => ToastInstance
}

export const toast: ToastExposeAPI = {
  //
} as ToastExposeAPI

toastTypes.forEach((type) => {
  toast[type] = (opt: string | ToastOption) => createToastInstance(opt as any, type)
})

export const toastCtx = reactive({
  installed: false as false | 'component' | 'app',
  instances: [] as ToastInstance[],
})

function createToastInstance(message: string, type: ToastType): ToastInstance
function createToastInstance(opt: Partial<ToastOption>, type: ToastType): ToastInstance
function createToastInstance(opt: Partial<ToastOption> | string, type: ToastType): ToastInstance {
  if (!toastCtx.installed) {
    installToastApp()
    toastCtx.installed = 'app'
  }

  const option = createToastOption(isString(opt) ? { message: opt } : opt)

  const ins = _createToastInstance(option, type)

  ins.show()

  return ins
}

export type ToastInstance = ReturnType<typeof _createToastInstance>

let seed = 0

function _createToastInstance(opt: ToastOption, type: ToastType) {
  let closeHandler: any

  const ins = {
    ...opt,
    id: `toast-${seed++}`,
    type,
    close() {
      remove(toastCtx.instances, ins)
    },
    show() {
      toastCtx.instances.push(ins)
      this.continueAutoClose()
    },
    stopAutoClose() {
      clearTimeout(closeHandler)
    },
    continueAutoClose() {
      closeHandler = setTimeout(() => ins.close(), ins.duration)
    },
  }

  return ins
}

function createToastOption(opt: Partial<ToastOption>): ToastOption {
  return {
    message: opt.message ?? '',
    duration: opt.duration ?? 2000,
  }
}
