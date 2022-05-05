import { is, uuid } from '@0x-jerry/utils'
import { installToastApp } from './install'

export interface ToastOption {
  message: string
  /**
   * @default 2000 ms
   */
  duration: number
}

interface ToastContextOption extends ToastOption {
  id: string
}

const toastTypes = ['success', 'error', 'info', 'warning'] as const

export type ToastType = typeof toastTypes[number]

interface ToastInstanceActions {
  close(): void
}

export type ToastExposeAPI = {
  [key in ToastType]: (opt: ToastOption | string) => ToastInstanceActions
}

export const toast: ToastExposeAPI = {
  //
} as ToastExposeAPI

toastTypes.forEach((type) => {
  toast[type] = (opt: string | ToastOption) => createToastInstance(opt as any, type)
})

export const toastCtx = reactive({
  installed: false as false | 'component' | 'app',
  instances: [] as ToastContextOption[],
})

const toastAction = {
  close(id: string) {
    const idx = toastCtx.instances.findIndex((item) => item.id === id)
    if (idx >= 0) toastCtx.instances.splice(idx, 1)
  },
}

function createToastInstance(message: string, type: ToastType): ToastInstanceActions
function createToastInstance(opt: Partial<ToastOption>, type: ToastType): ToastInstanceActions
function createToastInstance(opt: Partial<ToastOption> | string, type: ToastType) {
  if (!toastCtx.installed) {
    installToastApp()
    toastCtx.installed = 'app'
  }

  const option = createToastOption(is.string(opt) ? { message: opt } : opt)

  const ctxOpt: ToastContextOption = {
    ...option,
    id: uuid(),
  }

  toastCtx.instances.push(ctxOpt)

  const actions: ToastInstanceActions = {
    close() {
      toastAction.close(ctxOpt.id)
    },
  }

  if (ctxOpt.duration) {
    setTimeout(() => actions.close(), ctxOpt.duration)
  }

  return actions
}

function createToastOption(opt: Partial<ToastOption>): ToastOption {
  return {
    message: opt.message ?? '',
    duration: opt.duration ?? 2000,
  }
}
